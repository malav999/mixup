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
        let playlistId = req.params.pId;
        let userId = req.session.userId;

        utils.isString(playlistId, `playlistId ${playlistId}`)
        utils.isString(userId, `userId ${userId}`)

        let likesCommentsCollection = await likesComments();
        // get likes data by playlistId

        let likeData = await likesCommentsCollection.findOne({ "playlistId": ObjectID(playlistId) })

        // If any user has already liked or commented on a specified playlist then the data will already exits
        // Add the given userId to like
        // update likes
        if (likeData) {
            likeData.userIds.push(userId)

            // Update likes
            await likesCommentsCollection.updateOne({ _id: ObjectID(likeData._id) }, { $set: likeData })

            return await this.getLikesCommentsById(likeData._id)
        }

        // Create new like-comment object
        let newFeeds = {}
        newFeeds.playlistId = playlistId
        newFeeds.userIds = [userId]
        newFeeds.createdAt = new Date().toLocaleDateString()
        newFeeds.comments = []

        // Add likes-comments obj
        const insertInfo = await likesCommentsCollection.insertOne(newFeeds);
        // If insertion fails, throw err
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
        // Get likesComments by id
        const getLikesComments = await likesCommentsCollection.findOne({ _id: ObjectID(id) });

        if (!getLikesComments) throw 'Data not found'

        return getLikesComments;
    },

    /**
     * Add comment to a playlist
     * @param {*} req
     */
    async addComment(req) {
        let playlistId = req.params.pId
        let userId = req.session.userId
        let content = req.body.content

        utils.isString(playlistId, `playlistId ${playlistId}`)
        utils.isString(userId, `userId ${userId}`)
        utils.isString(content, `content ${content}`)
        let userCollection = await users()
        let user = await userCollection.findOne({ _id: ObjectID(userId) })

        let commentCollection = await likesComments()
        // Get like-comment object by playlistId
        let commentData = await commentCollection.findOne({ "playlistId": ObjectID(playlistId) })

        // If any user has already liked or commented on a specified playlist then the data will already exits
        // update comment obj
        if (commentData) {

            // Create a new comment object
            let commentObj = {}
            commentObj.userId = userId
            commentObj.content = content
            commentObj.name = user.firstName
            
            // add newly created comment obj to likes-comments
            commentData.comments.push(commentObj)
            await commentCollection.updateOne({ _id: ObjectID(commentData._id) }, { $set: commentData })

            return await this.getLikesCommentsById(commentData._id)
        }

        // Create new like-comment object
        let newFeeds = {}
        newFeeds.playlistId = playlistId
        newFeeds.comments = [{
            userId: userId,
            name: user.firstName,
            content: content
        }]
        newFeeds.createdAt = new Date().toLocaleDateString()
        newFeeds.userIds = []

        // Add likes-comments
        const insertInfo = await commentCollection.insertOne(newFeeds);
        // If insertion fails, err
        if (insertInfo.insertedCount === 0) throw "Could not add like-comment";
        const newId = insertInfo.insertedId;

        return this.getLikesCommentsById(newId)
    },

};