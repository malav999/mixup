const mongoCollections = require("../config/mongoCollections");
const songs = mongoCollections.songs;
const md5 = require('md5')
const userData = require('./user')
const users = mongoCollections.users;
const utils = require('./utils')
const playlists = mongoCollections.playlists;
const playlistData = require('./playlist')
const success = 'success'
const ObjectID = require('mongodb').ObjectID;

module.exports = {

    /**
     * Create song
     * @param {*} req 
     */
    async addSong(req) {
        let userId = req.body.userId
        let songURI = req.body.songURI
        let songName = req.body.songName
        let playlistId = req.body.playlistId

        utils.isString(userId, `userId ${userId}`)
        utils.isString(playlistId, `playlistId ${playlistId}`)
        utils.isString(songURI, `songURI ${songURI}`)
        utils.isString(songName, `songName ${songName}`)

        // Create new song object
        let newSong = {}
        newSong.songName = songName
        newSong.songURI = songURI
        newSong.playlistId = playlistId
        newSong.createdAt = new Date().toLocaleDateString()

        const songCollection = await songs();

        // Add song to db
        const insertInfo = await songCollection.insertOne(newSong);
        if (insertInfo.insertedCount === 0) throw "Could not add song";

        const newId = insertInfo.insertedId;

        // Get song by recently created song id
        const song = await this.getSongBySongId(newId);

        // If song not found, throw err
        if (!song) {
            console.log(`Song not found for ${newId}`)
            throw `Song not found`
        }

        let playlistCollection = await playlists();

        // Get playlist by playlistId
        let playlist = await playlistCollection.findOne({ _id: ObjectID(playlistId) })

        // If playlist find, throw err
        if (!playlist) {
            console.log(`Playlist not found for id ${playlistId}`)
            throw `Playlist not found`
        }

        playlist.songs.push(song._id)

        const updatePlaylist = await playlistCollection.updateOne({ _id: ObjectID(playlistId) }, { $set: playlist });

        if (updatePlaylist.modifiedCount === 0) {
            throw "could not update song successfully";
        }

        return await this.getSongBySongId(newId);
    },

    /**
     * Set song as deleted
     * @param {*} req 
     */
    async removeSong(req) {
        let id = req.body._id

        utils.isString(id, `id ${id}`)

        const songCollection = await songs();

        let song = await this.getSongBySongId(id)

        if (utils.isNull(song)) {
            console.log(`Song not found for ${id}`)
            throw `Song not found`
        }

        song.delete = true

        const updatedInfo = await songCollection.updateOne({ _id: id }, song);

        if (updatedInfo.modifiedCount === 0) {
            throw "could not update song successfully";
        }

        return success
    },

    /**
     * Update song info
     * @param {*} req 
     */
    async updateSong(req) {
        let songId = req.body.songId
        let songName = req.body.songName
        // let songs = req.body.songs

        utils.isString(songId, `song ${songId}`)
        utils.isString(songName, `song name ${songName}`)

        const songCollection = await songs();
        const updatedSong = {}
        if (songName) {
            updatedSong.songName = songName
        }

        if (updatedSong) {
            updatedInfo.updatedAt = new Date().toLocaleDateString();
            const updatedInfo = await songCollection.updateOne({ _id: id }, updatedSong);

            if (updatedInfo.modifiedCount === 0) {
                throw "could not update song successfully";
            }
        }

        return await this.getSongBySongId(id);
    },

    /**
     * Get a specific song
     * @param {*} id 
     */
    async getSongBySongId(id) {
        if (!id) throw "You must provide an id to search for";

        const songCollection = await songs();

        const song = await songCollection.findOne({ _id: ObjectID(id) });
        return song;
    },

    /**
     * Get all songs for given playlist id
     * @param {*} userId 
     */
    async getUserSongs(playlistId) {
        let userSongs = []
        const songArr = await songCollection.find({ _id: playlistId });

        utils.isArray(songArr, `songs `)

        // get only those songs which are not deleted
        for (let song of songArr) {
            if (song.isDeleted !== false) {
                userSongs.push(song)
            }
        }

        return userSongs
    },

    /**
     * Get all songs
     */
    async getAllSongs() {
        const songCollection = await songs();
        const songs = await songCollection.find({}).toArray();

        return songs;
    },

};
