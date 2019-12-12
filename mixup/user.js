const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const md5 = require('md5')
const utils = require('./utils')
const ObjectId = require('mongodb').ObjectID
const playlistData = require('./playlist')
const songData = require('./song')
const likesCommentData = require('./likesComments')
const request = require('request')
const rp = require('request-promise');

const client_id = '65606d7237bd4225baa410676a5a6e70'; // Your client id
const client_secret = '16e6770ee5a941f69f8bba78c73b1be1';
module.exports = {

    /**
     * User signup
     * @param {*} req 
     */
    async addUser(req) {
        let firstName = req.body.firstName
        let lastName = req.body.lastName
        // let gender = req.body.gender
        // let dob = req.body.dob
        let age = req.body.age
        let email = req.body.email
        let password = req.body.password
        let accessToken = ""
        let refreshToken = ""
        //the exact time when access token for spotify was added in the db
        let sTokenTimeAdded = 0;

        // let accessToken = req.body.accessToken
        // let refreshToken = req.body.refreshToken

        utils.isString(firstName, `first name ${firstName}`)
        utils.isString(lastName, `last name ${lastName}`)
        utils.isString(password, `password ${password}`)
        utils.isNumber(age, `age ${age}`)
        // utils.isString(gender, `gender ${gender}`)
        // utils.isString(dob, `DOB ${dob}`)
        // utils.isString(accessToken, `accessToken ${accessToken}`)
        // utils.isString(refreshToken, `refreshToken ${refreshToken}`)

        // If email is invalid, throw err
        if (utils.isValidEmail(email) === false) {
            console.log(`Invalid email ${email}`)
            throw 'Invalid input'
        }

        // Get all users
        let allUsers = await this.getAllUsers()

        email = email.toLowerCase()
        // Users will be empty only at the first time while creation of collection 
        if (allUsers !== []) {
            for (let user of allUsers) {
                // If user email already exist, don't allow to make new account with same email
                if (user.email === email) {
                    throw `Account with Email-Id ${email} already exist`
                }
            }
        }

        firstName = firstName.toUpperCase()
        lastName = lastName.toUpperCase()

        // Create new user object
        let newUser = {}
        newUser.firstName = firstName
        newUser.lastName = lastName
        // newUser.gender = gender
        // newUser.dob = dob
        newUser.age = age
        newUser.email = email
        newUser.createdAt = new Date().toLocaleDateString()
        newUser.playlistIds = []
        newUser.isDeleted = false
        // https://www.npmjs.com/package/md5
        newUser.password = md5(password)
        newUser.accessToken = accessToken
        newUser.refreshToken = refreshToken
        newUser.sTokenTimeAdded = sTokenTimeAdded

        const userCollection = await users();

        // Add user to db
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw "Could not add user";

        const newId = insertInfo.insertedId;

        // Get user by user id
        const user = await this.getUserById(newId);

        return user;
    },

    /**
     * User login
     * @param {*} req 
     * @returns user_id
     */
    async userSignin(req) {
        let email = req.body.email
        let password = req.body.password

        // If email is invalid, throw err
        if (utils.isValidEmail(email) === false) {
            console.log(`Invalid email ${email}`)
            throw 'Email or Password is invalid'
        }

        utils.isString(password, `email or password ${password}`)

        const userCollection = await users();

        email = email.toLowerCase()

        // get user for the given email
        const user = await userCollection.findOne({ email: email });

        // If user not found for a given email, err
        if (!user) throw `User not found for email: ${email}`

        // If password is incorrect, err
        if (user.password !== md5(password)) {
            throw `User email-id or password is incorrect`
        }

        return user._id;
    },

    /**
     * Set user as deleted
     * @param {*} req 
     */
    async removeUser(req) {
        let id = req.body._id
        if (!id) throw "You must provide an id to search for";

        const userCollection = await users();

        let user = await this.getUserById(id)
        if (!user) throw `User not found`

        user.delete = true

        const updatedInfo = await userCollection.updateOne({ _id: id }, user);

        if (updatedInfo.modifiedCount === 0) {
            throw "could not update user successfully";
        }
    },

    /**
     * Update user info
     * @param {*} req 
     */
    async updateUser(req) {
        let firstName = req.body.firstName
        let lastName = req.body.lastName
        // let gender = req.body.gender
        let age = req.body.age
        let userId = req.body.userId

        if (!userId) throw "Invalid request";

        let user = await this.getUserById(userId)
        if (!user) throw `User not found`

        const userCollection = await users();

        if (firstName) {
            user.firstName = firstName
        }

        if (lastName) {
            user.lastName = lastName
        }

        // if (gender) {
        //     user.gender = gender
        // }

        if (age) {
            user.age = age
        }

        if (user) {
            user.updatedAt = new Date().toLocaleDateString()
            const updatedInfo = await userCollection.updateOne({ _id: userId }, { $set: user });

            if (updatedInfo.modifiedCount === 0) {
                throw "could not update user successfully";
            }
        }

        return await this.getUserById(id);
    },

    /**
     * Get a specific user and user's playlists details
     * @param {*} id 
     */
    async getUserById(id) {
        if (!id) throw "You must provide an id to search for";

        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id });

        if (utils.isNull(user) === false) {
            console.log(`User not found with id ${id}`)
            throw "No user with that id";
        }

        let userObj = {}
        userObj.user = user

        if (Array.isArray(user.playListIds) && user.playListIds.length > 0) {
            userObj.songArr = []

            for (let playlistId of user.playListIds) {
                let playlist = playlistData.getPlaylist(playlistId)
                if (!utils.isNull(playlist)) {
                    userObj.userPlaylists = playlist
                    for (let songId of playlist.songIds) {
                        let song = songData.getSongBySongId(songId)
                        if (!utils.isNull(song)) {
                            userObj.songArr.push(song)
                        }
                    }
                }

                // get number of likes for given playlist
                let likes = likesCommentData.getLikesById(playlistId)
                if (!utils.isNumber(likes)) {
                    userObj.likes
                }

                // get all comments user has commented on given playlist
                let comments = likesCommentData.getCommentsById(playlistId)
                if (!utils.isNull(comments)) {
                    userObj.likes
                }
            }
        }

        return userObj;
    },
    /**
     * To check if the user has a access and refresh Token for spotify 
     * @param {UserId to check token for} userId 
     */
    async checkSpotifyTokens(userId) {
        const userCollection = await users();
        userId = ObjectId(userId)
        const user = await userCollection.findOne({ _id: userId });

        if (user.accessToken != "" && user.refreshToken != "") {
            return true;
        }
        else {
            return false;
        }
    },
    /**
     * adds the access and refresh token for the usero once autherized 
     * @param {*} userId 
     * @param {*} accessToken 
     * @param {*} refreshToken 
     * @param {*} timeAdded 
     */
    async addSpotifyTokens(userId, accessToken, refreshToken, timeAdded) {
        const userCollection = await users();
        userId = ObjectId(userId);
        const count = await userCollection.updateOne({ _id: userId }, { $set: { accessToken: accessToken, refreshToken: refreshToken, sTokenTimeAdded: timeAdded } });

        if (count.modifiedCount == 0) {
            throw "Error occoured while storing access and refresh token for the spotify user"
        }
    },

    /**
     * returns spotify accessToken for the user 
     * @param {userId} userId 
     */
    async getSpotifyToken(userId) {
        const userCollection = await users();
        userId = ObjectId(userId);
        userObj = await userCollection.findOne({ _id: userId })
        let currTime = Date.now();
        let tokenTime = userObj.sTokenTimeAdded;

        if (currTime - tokenTime > 1800000) {

            let refresh_Token = userObj.refreshToken;
            console.log("AccessToken before update : " + userObj.accessToken)
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
                form: {
                    grant_type: 'refresh_token',
                    refresh_token: refresh_Token
                },
                json: true
            };
            let newAccessToken = 0;


            await rp.post(authOptions, async function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    newAccessToken = response.body.access_token;
                    console.log("AccessToken after update : " + newAccessToken);
                    //update access_token and time in db and rerturn it 
                }
            });

            const count = await userCollection.updateOne({ _id: userId }, { $set: { accessToken: newAccessToken, sTokenTimeAdded: currTime } });

            return newAccessToken;



        }

        return userObj.accessToken;
    },
    /**
     * Get all users not removed from the system
     */
    async getAllUsers() {
        const userCollection = await users();
        const userArr = await userCollection.find({}).toArray();

        return userArr;
    },

};

