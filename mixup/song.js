const mongoCollections = require("../config/mongoCollections");
const songs = mongoCollections.songs;
const youtubeSongs = mongoCollections.youtubeSongs;
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
        let userId = req.session.userId
        let songURI = req.body.songURI
        let songName = req.body.songName
        let playlistId = req.session.playlistId
        let platform = req.body.platform

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

        if (undefined !== platform && platform !== null && typeof (platform) === "string") {
            newSong.platform = platform
        }

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
        const allSongs = await songCollection.find({}).toArray();

        return allSongs;
    },

    /**
     * To get youtube songs from the database
     * @param {*} req 
     */
    async getYoutubeSongs() {
        const ytSongCollection = await youtubeSongs();
        const allSongs = await ytSongCollection.find({}).toArray();
        return allSongs;
    },

    /**
     * Search songs by given songs name on YouTube
     * @param {*} req 
     */
    async searchSongYoutube(req) {
        let songName = req.body.searchBar

        let allSongs = await this.getYoutubeSongs();

        if (!Array.isArray(allSongs) || allSongs.length <= 0 || allSongs === []) {
            console.log('No song found')
            throw `No song found`
        }

        songName = songName.toLowerCase()

        let searchResult = []
        for (let song of allSongs) {
            if (song.songName.toLowerCase().includes(songName)) {
                searchResult.push(song)
            }
        }

        if (searchResult.length === 0) {
            console.log('No related songs found')
            throw `No related songs found for ${songName}`
        }

        if (searchResult.length > 5) {
            searchResult = searchResult.slice(0, 5)
        }

        return searchResult
    },

    /**
     * Get all songs for the given userId
     * @param {*} req 
     */
    async getUserSongs(req) {
        let userId = req.session.userId
        utils.isString(userId, `userId ${userId}`)

        let songCollection = await songs()

        // Get all songs
        let allSongs = await this.getAllSongs()
        // If no songs found return empty
        if (undefined === allSongs || allSongs === null || !Array.isArray(allSongs) || allSongs.length < 1) {
            return []
        }

        let songArr = []

        // Get all the songs of a specific user
        for (let song of allSongs) {
            let userSong = await songCollection.findOne({ userId: song.userId })
            if (userSong) {
                songArr.push(userSong)
            }
        }

        // If no songs found return empty array
        if (songArr.length < 1) {
            return songArr
        }

        return songArr
    },

    /**
     * Add youtube songs (using seed file) 
     * @param {*} songName 
     * @param {*} songURI 
     * @param {*} songId 
     */
    async addSongToYouTube(songName, songURI, songId, platform) {

        utils.isString(songURI, `songURI ${songURI}`)
        utils.isString(songName, `songName ${songName}`)
        utils.isString(songId, `songId ${songId}`)
        utils.isString(platform, `platform ${platform}`)
        let createdAt = new Date().toLocaleDateString()

        const youtubeSongsCollection = await youtubeSongs();

        songName = songName.toLowerCase()

        let songObj = {}
        songObj.songURI = songURI
        songObj.songName = songName
        songObj.songId = songId
        songObj.platform = platform
        songObj.createdAt = createdAt

        let insertInfo = await youtubeSongsCollection.insertOne(songObj)
        if (insertInfo.insertedCount === 0) throw "Could not add song";

        const newId = insertInfo.insertedId;

        // // Get song by recently created song id
        const song = await this.getYoutubeSongBySongId(newId);
        return song
    },

    /**
     * Get a specific song
     * @param {*} id 
     */
    async getYoutubeSongBySongId(id) {
        if (!id) throw "You must provide an id to search for";
        const youtubeSongsCollection = await youtubeSongs();
        const song = await youtubeSongsCollection.findOne({ _id: ObjectID(id) });
        console.log(song)
        return song;
    },

};