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

        user.playlistIds.push(insertInfo.insertedId)

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

        if (undefined === allPlaylists && !Array.isArray(allPlaylists) && allPlaylists.length === 0) {
            return []
        }

        let likesCommentsCollection = await likesComments()
        let likesCommentsArr = await likesCommentsCollection.find({}).toArray()

        let playlistArr = []
        let playlistObj = {}

        // let playlistCollection = await playlists()
        let userCollection = await users()

        for (let playlist of allPlaylists) {
            let user = await userCollection.findOne({ _id: ObjectID(playlist.userId) })

            if (utils.isNull !== false) {
                playlistObj.userName = user.firstName
            }

            playlistObj.playlistName = playlist.playlistName

            let pId = playlist._id.toString()
            playlistObj.playlistId = pId

            let songCollection = await songs()

            if (Array.isArray(playlist.songs) && playlist.songs.length > 0) {
                let songArr = []
                for (let songId of playlist.songs) {
                    let playlistSong = await songCollection.findOne({ _id: ObjectID(songId) })
                    if (utils.isNull !== playlistSong) {
                        songArr.push(playlistSong)
                    }
                }
                playlistObj.songs = songArr
            }

            if (Array.isArray(likesCommentsArr) && likesCommentsArr.length > 0) {
                for (let like of likesCommentsArr) {

                    let likesCommentObj = await likesCommentsCollection.findOne({ playlistId: pId })

                    if (utils.isNull(likesCommentObj !== false)) {

                        if (likesCommentObj.playlistId === pId) {

                            if (undefined !== like.userIds && Array.isArray(like.userIds) && like.userIds !== null) {
                                playlistObj.likes = like.userIds.length
                            }

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

            playlistArr.push(playlistObj)
        }

        return playlistArr
    },

    // /**
    //  * Get most liked playlist
    //  */
    // async motsLikedPlaylist() {
    //     let likesCommentsCollection = await likesComments()
    //     let likes = await likesCommentsCollection.find({}).toArray()

    //     let mostLikedPlaylist = {}
    //     mostLikedPlaylist.max = 0
    //     for (let like of likes) {
    //         if (mostLikedPlaylist.max < like.userIds.length) {
    //             mostLikedPlaylist.playlistId = like.playlistId
    //             mostLikedPlaylist.max = like.userIds.length
    //         } else {
    //             console.log('No top playlist')
    //         }
    //     }

    //     let playlistCollection = await playlists()
    //     let playlist = await playlistCollection.findOne({ _id: mostLikedPlaylist.playlistId })
    //     if (utils.isNull(playlist)) {
    //         console.log(`Playlist not found for playlistId ${sortData[i].playlistId}`)
    //         throw `Playlist not found with playlistId`
    //     }

    //     return mostLikedPlaylist

    // },

    // /**
    //  * Get top five most liked playlist
    //  */
    // async topFivePlaylists() {
    //     let playlistsCollection = await playlists()
    //     let playlistObj = await playlistsCollection.find({}).toArray()

    //     let likesCommentsCollection = await likesComments()
    //     let likes = await likesCommentsCollection.find({}).toArray()

    //     let topArr = []
    //     // Create a new obj with playlistId and max likes
    //     let mostLikedPlaylist = {}
    //     // mostLikedPlaylist.max = 0

    //     for (let like of likes) {
    //         mostLikedPlaylist.playlistId = like.playlistId
    //         mostLikedPlaylist.max = like.userIds.length
    //         topArr.push(mostLikedPlaylist)
    //     }

    //     // Sort likes in ascending order based on the max no of like playlist got
    //     let sortData = topArr.sort((a, b) => (a.max > b.max) ? 1 : ((b.max > a.max) ? -1 : 0));

    //     let topFive = []
    //     let playlistCollection = await playlists()

    //     // get top five playlist
    //     for (let i = 0; i < 5; i++) {
    //         // get playlist by playlistId
    //         let playlist = await playlistCollection.findOne({ _id: ObjectID(sortData[i].playlistId) })
    //         console.log('playlist', playlist)

    //         // if playlist not found throw err
    //         if (utils.isNull(playlist) === true) {
    //             console.log(`Playlist not found for playlistId ${sortData[i].playlistId}`)
    //         }
    //         topFive.push(playlist)
    //     }

    //     if (sortData.length > 5) {
    //         sortData = sortData.slice(0, 5)
    //     }

    //     // get top five playlist
    //     for (let playlist of sortData) {
    //         // get playlist by playlistId
    //         let playlist = await playlistCollection.findOne({ _id: ObjectID(sortData[i].playlistId) })
    //         console.log('playlist', playlist)

    //         // if playlist not found throw err
    //         if (utils.isNull(playlist) === true) {
    //             console.log(`Playlist not found for playlistId ${sortData[i].playlistId}`)
    //         }
    //         topFive.push(playlist)
    //     }

    //     return topFive
    // },


    /**
     * Get all playlists details (userName, playlistName, likes & comments)
     */
    async topFive() {
        let playlistCollection = await playlists()
        let allPlaylists = await playlistCollection.find({}).toArray()

        if (undefined === allPlaylists && !Array.isArray(allPlaylists) && allPlaylists.length === 0) {
            return []
        }

        let likesCommentsCollection = await likesComments()
        let likesCommentsArr = await likesCommentsCollection.find({}).toArray()

        let playlistArr = []
        let playlistObj = {}

        // let playlistCollection = await playlists()
        let userCollection = await users()

        for (let playlist of allPlaylists) {
            let user = await userCollection.findOne({ _id: ObjectID(playlist.userId) })

            if (utils.isNull !== false) {
                playlistObj.userName = user.firstName
            }

            playlistObj.playlistName = playlist.playlistName

            let pId = playlist._id.toString()
            playlistObj.playlistId = pId

            let songCollection = await songs()

            if (Array.isArray(playlist.songs) && playlist.songs.length > 0) {
                let songArr = []
                for (let songId of playlist.songs) {
                    let playlistSong = await songCollection.findOne({ _id: ObjectID(songId) })
                    if (utils.isNull !== playlistSong) {
                        songArr.push(playlistSong)
                    }
                }
                playlistObj.songs = songArr
            }

            if (Array.isArray(likesCommentsArr) && likesCommentsArr.length > 0) {
                for (let like of likesCommentsArr) {

                    let likesCommentObj = await likesCommentsCollection.findOne({ playlistId: pId })

                    if (utils.isNull(likesCommentObj !== false)) {

                        if (likesCommentObj.playlistId === pId) {

                            if (undefined !== like.userIds && Array.isArray(like.userIds) && like.userIds !== null) {
                                playlistObj.likes = like.userIds.length
                            }

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

            playlistArr.push(playlistObj)
        }

        let sortData = playlistArr.sort((a, b) => (a.likes > b.likes) ? 1 : ((b.likes > a.likes) ? -1 : 0));

        if (sortData.length > 5) {
            sortData = sortData.slice(0, 5)
        }

        return sortData
    },


};
