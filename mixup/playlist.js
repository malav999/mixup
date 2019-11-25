const mongoCollections = require("../config/mongoCollections");
const playlists = mongoCollections.playlists;
const users = mongoCollections.users;
const songs = mongoCollections.songs;
const userData = require('./user');
const likesCommentsData = require('./likes-comments');
const songData = require('./song');
const ObjectID = require('mongodb').ObjectID;
const utils = require('./utils');

module.exports = {

    /**
     * Create playlist
     * @param {*} req
     */
    async createPlaylist(req) {
        let userId = req.body.userId
        let playlistName = req.body.playlistName

        if (!userId) {
            console.log('Blank userId ', userId)
            throw "Invalid Request"
        };

        if (!playlistName) {
            console.log('Blank playlist name ', playlistName)
            throw "Blank playlist name"
        };

        // Get user who is creating the playlist
        let user = await userData.getUserById(userId)
        if (!user) {
            throw `User not found`
        }

        // If user has already created playlist
        // Check if the new playlist does not have the same name as alraedy created playlist 
        if (user.playlistIds.length > 0) {
            for (let playlistId of user.playlistIds) {
                let userPlaylist = await this.getPlaylistById(playlistId)
                if (userPlaylist) {
                    if (userPlaylist.playlistName === name) {
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

        // Add playlist
        const insertInfo = await playlistCollection.insertOne(newPlaylist);
        // If insertion fails, err
        if (insertInfo.insertedCount === 0) throw "Could not add playlist";

        let userCollection = await users();
        // todo: Update playlistId in user

        user.playlistIds = [insertInfo.insertedId]

        const updateUserPlaylist = await userCollection.updateOne({ _id: ObjectID(userId), user });
        if (updateUserPlaylist.modifiedCount === 0) {
            throw "could not update playlist successfully";
        }

        const newId = insertInfo.insertedId;
        console.log('insertInfo.value: ', insertInfo.value)
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
    async getPlaylist(id) {
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
     * Get all playlists
     */
    async getAllPlaylists() {
        const playlistCollection = await playlists();
        const playlists = await playlistCollection.find({}).toArray();

        return playlists;
    },

};
