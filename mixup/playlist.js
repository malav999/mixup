const mongoCollections = require("../config/mongoCollections");
const playlists = mongoCollections.playlists;
const users = mongoCollections.users;
const songs = mongoCollections.songs;
const userData = require('./user');
const likesCommentsData = require('./likesComments');
const songData = require('./song');
const ObjectID = require('mongodb').ObjectID;
const utils = require('./utils');
const success = 'success'
let likesComments = mongoCollections.likesComments;

module.exports = {

    /**
     * Create playlist
     * @param {*} req
     */
    async createPlaylist(req) {
        let userId = req.session.userId;
        let playlistName = req.body.playlistName

        utils.isString(userId, `userId ${userId}`)
        utils.isString(playlistName, `playlistName ${playlistName}`)

        const userCollection = await users();

        // Get user who is creating the playlist
        const user = await userCollection.findOne({ _id: ObjectID(userId) });
        if (!user) {
            throw `User not found`
        }

        // If user has already created playlist
        // Check if the new playlist does not have the same name as alraedy created playlist 
        if (user.playlistIds.length > 0) {
            for (let playlistId of user.playlistIds) {
                let userPlaylist = await this.getPlaylistById(playlistId)
                if (userPlaylist) {
                    if (userPlaylist.playlistName === playlistName) {
                        throw `Playlist with the same name already exists`
                    }
                }
            }
        }

        // Create new playlist object
        let newPlaylist = {}
        newPlaylist.playlistName = playlistName
        newPlaylist.userId = userId
        newPlaylist.songs = []
        newPlaylist.createdAt = new Date().toLocaleDateString()

        const playlistCollection = await playlists();

        // Add playlist to db
        const insertInfo = await playlistCollection.insertOne(newPlaylist);

        // If insertion fails, err
        if (insertInfo.insertedCount === 0) throw "Could not add playlist";

        let playlistId = insertInfo.insertedId.toString()
        user.playlistIds.push(playlistId)

        // update playlist id in user
        const updateUserPlaylist = await userCollection.updateOne({ _id: ObjectID(userId) }, { $set: user });

        if (updateUserPlaylist.modifiedCount === 0) {
            throw "could not update playlist successfully";
        }

        const newId = insertInfo.insertedId;
        const playlist = await this.getPlaylistById(newId);

        return playlist;
    },

    /**
     * Set playlist as deleted
     * @param {*} req 
     */
    async removePlaylist(req) {
        let playlistIds = req.body.playlistIds
        if (!playlistIds) throw "Invalid requ";

        if (playlistIds.length === 0) {
            throw `Invalid request`
        }

        const playlistCollection = await playlists();

        for (let playlistId of playlistIds) {

            let playlist = await this.getPlaylistById(id)
            if (playlist) {
                playlist.delete = true

                const updatedInfo = await playlistCollection.updateOne({ _id: ObjectID(playlistId) }, playlist);

                if (updatedInfo.modifiedCount === 0) {
                    throw "Could not update playlist successfully";
                }
            }
        }

        return this.getPlaylistById(pla)
    },

    /**
     * Update playlist info
     * @param {*} req 
     */
    async updatePlaylist(req) {
        let playlistId = req.body.playlistId
        let playlistName = req.body.playlistName
        // let songs = req.body.songs

        if (!playlistId) throw "Invalid request";
        if (!playlistName) throw "Invalid request";

        const playlistCollection = await playlists();
        const updatedPlaylist = {}
        if (playlistName) {
            updatedPlaylist.playlistName = playlistName
        }

        if (updatedPlaylist) {
            updatedInfo.updatedAt = new Date().toLocaleDateString();
            const updatedInfo = await playlistCollection.updateOne({ _id: ObjectID(playlistId) }, updatedPlaylist);

            if (updatedInfo.modifiedCount === 0) {
                throw "could not update playlist successfully";
            }
        }

        return await this.getPlaylistById(id);
    },

    /**
     * Get a specific playlist
     * @param {*} id 
     */
    async getPlaylistById(id) {
        if (!id) throw "You must provide an id to search for";

        const playlistCollection = await playlists();
        const playlist = await playlistCollection.findOne({ _id: ObjectID(id) });

        if (playlist === null) throw "No playlist with that id";

        return playlist;
    },

    /**
     * Get playlists for a specific user
     * @param {*} user
     */
    async getPlaylistByUser(user) {
        const playlistCollection = await playlists();

        let playlistArr = []

        if (Array.isArray(user.playlistIds) && user.playlistIds.length > 0) {
            for (let playlistId of user.playlistIds) {
                let playlist = await playlistCollection.findOne({ _id: ObjectID(playlistId) });
                playlistArr.push(playlist)
            }
        }

        return playlistArr;
    },

    /**
     * check if player added atleast one song in current playlist
     */
    async checkPlaylistLength(playlistId) {
        const playlistCollection = await playlists();
        playlistId = ObjectID(playlistId);
        let playListArr = await playlistCollection.findOne({ _id: playlistId });
        if (playListArr.songs.length == 0) {
            throw "You need to add atleast one song in playlist before saving"
        }
    },

    /**
     * Get all playlists
     */
    async getAllPlaylists() {
        const playlistCollection = await playlists();
        const playlists = await playlistCollection.find({}).toArray();

        return playlists;
    },

    /**
     * Get all playlists details (userName, playlistName, likes & comments)
     */
    async getAllPlaylistsDetails() {
        let playlistCollection = await playlists()
        let allPlaylists = await playlistCollection.find({}).toArray()

        // if no playlist exists, return an empty arr
        if (undefined === allPlaylists && !Array.isArray(allPlaylists) && allPlaylists.length === 0) {
            return []
        }

        // Get likesComments db collection
        let likesCommentsCollection = await likesComments()
        // Get all the likes comments
        let likesCommentsArr = await likesCommentsCollection.find({}).toArray()

        let playlistArr = []

        // Get users db collection
        let userCollection = await users()
        

        for (let playlist of allPlaylists) {
            let playlistObj = {}
            // Get user by userId
            let user = await userCollection.findOne({ _id: ObjectID(playlist.userId) })

            // If user is not null get user name
            if (utils.isNull(user) !== false) {
                playlistObj.userName = user.firstName
            }

            playlistObj.playlistName = playlist.playlistName
            
            let pId = playlist._id.toString()
            playlistObj.playlistId = pId
            
            // Get songs db collection
            let songCollection = await songs()

            // If songs are added under the playlist
            // get songs  
            if (Array.isArray(playlist.songs) && playlist.songs.length > 0) {
                let songArr = []
                for (let songId of playlist.songs) {
                    // Get songs by song id
                    let playlistSong = await songCollection.findOne({ _id: ObjectID(songId) })
                    // If songs exits add that song to playlistObj
                    if (utils.isNull !== playlistSong) {
                        songArr.push(playlistSong)
                    }
                }
                playlistObj.songs = songArr
            }

            // If likes and comments are added for the playlist
            // Get likes and comments
            if (Array.isArray(likesCommentsArr) && likesCommentsArr.length > 0) {
                for (let like of likesCommentsArr) {
                    // Get likes and comments by playlistId
                    let likesCommentObj = await likesCommentsCollection.findOne({ playlistId: pId })

                    // Check if the like comment object exist
                    if (likesCommentObj!== undefined && likesCommentObj !== null) {

                        // if likeComment obj playlistId is equal to given playlist 
                        // get the number of likes
                        if (likesCommentObj.playlistId === pId) {
                            // Check if the like data exits
                            if (undefined !== like.userIds && Array.isArray(like.userIds) && like.userIds !== null) {
                                playlistObj.likes = like.userIds.length
                            }
                            // If comments exists, get comment data
                            if (Array.isArray(likesCommentObj.comments) && likesCommentObj.comments.length > 0) {
                                let comments = []

                                for (let comm of likesCommentObj.comments) {
                                    comments.push(comm.content)
                                }

                                playlistObj.comments = comments
                            }
                        }
                    }
                }
            }

            // add whole object to playlist arr
            playlistArr.push(playlistObj)
        }

        return playlistArr
    },

    /**
     * Get all playlists details (userName, playlistName, likes & comments)
     */
    async topFive() {
        let playlistArr = await this.getAllPlaylistsDetails()

        let sortData = playlistArr.sort((a, b) => (a.likes > b.likes) ? 1 : ((b.likes > a.likes) ? -1 : 0));

        if (sortData.length > 5) {
            sortData = sortData.slice(0, 5)
        }

        return sortData
    },

};
