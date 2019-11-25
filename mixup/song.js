const mongoCollections = require("../config/mongoCollections");
const songs = mongoCollections.songs;
const md5 = require('md5')
const userData = require('./user')
const users = mongoCollections.users;
const utils = require('./utils')
const playlists = mongoCollections.playlists;
const playlistData = require('./playlist')
const success = 'success'

module.exports = {

    /**
     * Create song
     * @param {*} req 
     */
    async addSong(req) {
        let userId = req.body.userId
        let songURI = req.body.songUri
        let songName = req.body.songName
        let playlistId = req.body.playlistId

        utils.isString(userId, `userId ${userId}`)
        utils.isString(playlistId, `playlistId ${playlistId}`)
        utils.isString(songURI, `songURI ${songURI}`)
        utils.isString(songName, `songName ${songName}`)

        let newSong = {}
        newSong.songName = songName
        newSong.songURI = songURI
        // remove userId
        // newSong.userId = userId
        newSong.playlistId = playlistId
        newSong.createdAt = new Date().toLocaleDateString()

        const songCollection = await songs();
        const insertInfo = await songCollection.insertOne(newSong);
        if (insertInfo.insertedCount === 0) throw "Could not add song";

        const newId = insertInfo.insertedId;
        console.log('insertInfo.value:', insertInfo.value)
        const song = await this.getSongBySongId(newId);

        if (utils.isNull(song)) {
            console.log(`Song not found for ${newId}`)
            throw `Song not found for ${newId}`
        }

        let playlistCollection = await playlists();

        // todo: Update songId in user
        let playlist = {}
        playlist.songs = [song._id]

        const updateUserSong = await playlistCollection.updateOne({ _id: ObjectID(userId), playlist });

        if (updateUserSong.modifiedCount === 0) {
            throw "could not update song successfully";
        }

        return song;
    },

    /**
     * Set song as deleted
     * @param {*} req 
     */
    async removeSong(req) {
        let id = req.body._id

        utils.isString(id, `id ${id}`)

        const songCollection = await songs();

        let song = await this.getSongById(id)

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

        return await this.getSongById(id);
    },

    /**
     * Get a specific song
     * @param {*} id 
     */
    async getSongBySongId(id) {
        if (!id) throw "You must provide an id to search for";

        const songCollection = await songs();

        const song = await songCollection.findOne({ _id: id });

        if (utils.isNull(song)) {
            console.log(`No song with id ${id}`)
            throw 'No song found'
        }

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
