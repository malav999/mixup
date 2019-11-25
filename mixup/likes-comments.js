const mongoCollections = require("../config/mongoCollections");
const playlists = mongoCollections.playlists;
const users = mongoCollections.users;
const songs = mongoCollections.songs;
const likesComments = mongoCollections.likesComments;
const md5 = require('md5');
const userData = require('./user');
const playlistData = require('./playlist');
const ObjectID = require('mongodb').ObjectID
const utils = require('./utils')

module.exports = {

    /**
     * Create playlist
     * @param {*} req
     */
    async addLikeComment(req) {
        let playlistId = req.body.playlistId
        let userId = req.body.userId
        let userName = req.body.userName
        let content = req.body.content
        let like = req.body.like

        utils.isString(playlistId, `playlistId ${playlistId}`)
        utils.isString(userId, `userId ${userId}`)
        // utils.isString(content, `content ${content}`)
        utils.isString(userName, `userName ${userName}`)
        // utils.isString(like, `like ${like}`)


        // Create new like-comment object
        let newFeeds = {}
        newFeeds.playlistI = playlistName
        newFeeds.userId = userId
        newFeeds.like = [userId]
        newFeeds.createdAt = new Date().toLocaleDateString()

        const likesCommentsCollection = await likesComments();

        // Add likes-comments
        const insertInfo = await likesCommentsCollection.insertOne(newFeeds);
        // If insertion fails, err
        if (insertInfo.insertedCount === 0) throw "Could not add like-comment";
        const newId = insertInfo.insertedId;

        return this.getLikesById(newId)
    },

    /**
     * Set playlist as deleted
     * @param {*} req 
     */
    async removePlaylist(req) {
        let playlistIds = req.body.playlistIds
        if (!playlistIds) throw "You must provide an id to search for";

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
    async getLikesById(playlistId) {
        if (!playlist) throw "You must provide an id to search for";

        const likesCommentsCollection = await likesComments();
        const likesComments = await likesCommentsCollection.findOne({ playlistId: ObjectID(playlistId) });

        if (likesComments === null) throw "No likesComments with that id";

        !utils.isArray(likesComments.userIds, `userIds ${likesComments.userIds}`)

        return likesComments.userIds.length;
    },

    /**
     * Get all playlists
     */
    async getAllPlaylists() {
        const playlistCollection = await playlists();
        const playlists = await playlistCollection.find({}).toArray();

        return playlists;
    },

};
