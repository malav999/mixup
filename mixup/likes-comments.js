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
    async addLike(req) {
        let playlistId = req.body.playlistId
        let userId = req.body.userId
        // let userName = req.body.userName
        let content = req.body.content
        let like = req.body.like

        utils.isString(playlistId, `playlistId ${playlistId}`)
        utils.isString(userId, `userId ${userId}`)
        // utils.isString(userName, `userName ${userName}`)
        utils.isString(content, `content ${content}`)
        utils.isString(like, `like ${like}`)

        // If playlistId alraedy exist Update add the userId who liked the playlist
        let likesCollection = await likes()
        let getPastLikesData = await likesCollection.findOne({ playlistId: playlistId })

        if (getPastLikesData) {
            getPastLikesData.userIds.push(userId)

            let updateLikes = await likesCollection.updateOne({ _id: ObjectID(getPastLikesData._id) }, { $set: { getPastLikesData } })

            return await this.getLikesById(getPastLikesData._id)
        }

        // Create new like-comment object
        let newFeeds = {}
        newFeeds.playlistId = playlistId
        // newFeeds.userId = userId
        newFeeds.userIds = [userId]
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
    async removeLikes(req) {
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
     * Get a specific playlist
     * @param {*} id 
     */
    async getLikesById(id) {
        if (!id) throw "You must provide an id to search for";

        const likesCommentsCollection = await likesComments();
        const likesComments = await likesCommentsCollection.findOne({ id: ObjectID(id) });

        return likesComments.userIds.length;
    },

};
