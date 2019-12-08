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
        let likeData = await likesCollection.findOne({ playlistId: playlistId })
        console.log('likedata', likeData)
        if (likeData) {
            likeData.userIds.push(userId)

            let updateLikes = await likesCollection.updateOne({ _id: ObjectID(likeData._id) }, likeData)
            console.log(12)
            return await this.getLikesCommentsById(likeData._id)
        }

        // Create new like-comment object
        let newFeeds = {}
        newFeeds.playlistId = playlistId
        newFeeds.userIds = [userId]
        newFeeds.createdAt = new Date().toLocaleDateString()
        newFeeds.comments = []
        const likesCommentsCollection = await likesComments();

        // Add likes-comments
        const insertInfo = await likesCommentsCollection.insertOne(newFeeds);
        // If insertion fails, err
        if (insertInfo.insertedCount === 0) throw "Could not add like-comment";

        const newId = insertInfo.insertedId;
        console.log('newId', newId)

        console.log(92)

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
        const getLikesComments = await likesCommentsCollection.findOne({ _id: ObjectID(id) });
        // console.log("getLikesComments", getLikesComments)

        if (!getLikesComments) throw 'Data not found'

        return getLikesComments;
    },

    /**
     * Add comment to a playlist
     * @param {*} req
     */
    async addComment(req) {
        let playlistId = req.body.playlistId
        let userId = req.body.userId
        let userName = req.body.name
        let content = req.body.content

        utils.isString(playlistId, `playlistId ${playlistId}`)
        utils.isString(userName, `userName ${userName}`)
        utils.isString(userId, `userId ${userId}`)
        utils.isString(content, `content ${content}`)

        // If playlistId alraedy exist Update add the userId who liked the playlist
        let commentCollection = await likesComments()
        let commentData = await commentCollection.findOne({ playlistId: playlistId })

        if (commentData) {
            let commentObj = {
                userId: userId,
                name: userName,
                content: content
            }

            commentData.comments.push(commentObj)
            await commentCollection.updateOne({ _id: ObjectID(commentData._id) }, commentData)

            return await this.getLikesCommentsById(commentData._id)
        }

        // Create new like-comment object
        let newFeeds = {}
        newFeeds.playlistId = playlistId
        newFeeds.comments = [{
            userId: userId,
            name: userName,
            content: content
        }]
        newFeeds.createdAt = new Date().toLocaleDateString()
        newFeeds.userIds = []
        const likesCommentsCollection = await likesComments();

        // Add likes-comments
        const insertInfo = await likesCommentsCollection.insertOne(newFeeds);
        // If insertion fails, err
        if (insertInfo.insertedCount === 0) throw "Could not add like-comment";
        const newId = insertInfo.insertedId;

        return this.getLikesCommentsById(newId)
    }
};
