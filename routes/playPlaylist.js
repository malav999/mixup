const express = require("express");
const router = express.Router();
const userData = require('../mixup/user')
const playlistData = require('../mixup/playlist')
const mongoCollections = require("../config/mongoCollections");
const songs = mongoCollections.songs;




router.use("/", async (req, res, next) => {
    let userId = req.session.userId;
    if (!userId) {
        //user is not logged in
        res.redirect('/user/signin');
    }
    else {
        next();
    }
});

router.get("/play/:playlistId", async (req, res) => {

    let userId = req.session.userId;
    let playlistId = req.params.playlistId;

    //To check if user has spotify access 
    let status = await userData.checkSpotifyTokens(userId);
    if (status === true) {
        let spotifyToken = await userData.getSpotifyToken(userId);
        try {
            const user = await userData.getUserDetailsById(req.session.userId);
            let playlistObj = await playlistData.getPlaylistById(playlistId);

            let songArr = [];

            for (let songId of playlistObj.songs) {
                let songCollection = await songs();
                let songObj = await songCollection.findOne({ _id: ObjectId(songId) })

                if (utils.isNull(songObj) !== false) {
                    songArr.push(songObj)
                }
            }

            var objToRtrn = {
                playlistObj : playlistObj,
                songArr: songArr
            }
            res.render("pages/playPlaylist", { accessToken: spotifyToken, playlistObj : objToRtrn})
        } catch (e) {
            
            console.log('err', e)
            res.render("pages/playPlaylist",{error:e});

        }

    }
    else {
        
        try {
            const user = await userData.getUserDetailsById(req.session.userId);
            let playlistObj = await playlistData.getPlaylistById(playlistId);

            let songArr = [];

            for (let songId of playlistObj.songs) {
                let songCollection = await songs();
                let songObj = await songCollection.findOne({ _id: ObjectId(songId) })

                if (utils.isNull(songObj) !== false) {
                    songArr.push(songObj)
                }
            }

            var objToRtrn = {
                playlistObj : playlistObj,
                songArr: songArr
            }
            res.render("pages/playPlaylist", { playlistObj : objToRtrn})
        } catch (e) {
            
            console.log('err', e)
            res.render("pages/playPlaylist",{error:e});
        }
        
    }
})




router.use("*", async (req, res) => {
    res.status(404).json({ error: "Page not found" });
})

module.exports = router;


