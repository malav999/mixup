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
     * Add Like to a playlist
     * @param {*} req
     */
    async addLike(req) {
        let playlistId = req.body.playlistId
        let userId = req.body.userId
        // let userName = req.body.userName
        // let content = req.body.content

        utils.isString(playlistId, `playlistId ${playlistId}`)
        utils.isString(userId, `userId ${userId}`)
        // utils.isString(userName, `userName ${userName}`)
        // utils.isString(content, `content ${content}`)

        // If playlistId alraedy exist Update add the userId who liked the playlist
        let likesCollection = await likesComments()
        let getPastLikesData = await likesCollection.findOne({ playlistId: playlistId })

        if (getPastLikesData) {
            getPastLikesData.userIds.push(userId)

            let updateLikes = await likesCollection.updateOne({ _id: ObjectID(getPastLikesData._id) }, { $set: { getPastLikesData } })

            return await this.getLikesCommentsById(getPastLikesData._id)
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

        return this.getLikesCommentsById(newId)
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
    async getLikesCommentsById(id) {
        if (!id) throw "You must provide an id to search for";

        const likesCommentsCollection = await likesComments();
        const likesComments = await likesCommentsCollection.findOne({ id: ObjectID(id) });

        return likesComments.userIds.length;
    },

    /**
     * Add comment to a playlist
     * @param {*} req
     */
    async addComment(req) {
        let playlistId = req.body.playlistId
        let userId = req.body.userId
        // let userName = req.body.userName
        let content = req.body.content
        // let like = req.body.like

        utils.isString(playlistId, `playlistId ${playlistId}`)
        utils.isString(userId, `userId ${userId}`)
        utils.isString(content, `content ${content}`)
        // utils.isString(like, `like ${like}`)
        // utils.isString(userName, `userName ${userName}`)


        // If playlistId alraedy exist Update add the userId who liked the playlist
        let commentCollection = await likesComments()
        let getPastCommentData = await commentCollection.findOne({ playlistId: playlistId })

        if (getPastCommentData) {
            let contentObj = {}
            contentObj.userId = userId
            contentObj.name = userName
            contentObj.comment = comment
            getPastCommentData.content.push(contentObj)

            let updateComment = await commentCollection.updateOne({ _id: ObjectID(getPastCommentData._id) }, { $set: { getPastCommentData } })

            return await this.getLikesCommentsById(getPastCommentData._id)
        }

        let contentObj = {}
        contentObj.userId = userId
        contentObj.name = userName
        contentObj.comment = comment

        // Create new like-comment object
        let newFeeds = {}
        newFeeds.playlistId = playlistId
        // newFeeds.userId = userId
        newFeeds.content = [contentObj]
        newFeeds.createdAt = new Date().toLocaleDateString()

        const likesCommentsCollection = await likesComments();

        // Add likes-comments
        const insertInfo = await likesCommentsCollection.insertOne(newFeeds);
        // If insertion fails, err
        if (insertInfo.insertedCount === 0) throw "Could not add like-comment";
        const newId = insertInfo.insertedId;

        return this.getLikesCommentsById(newId)
    }
};
