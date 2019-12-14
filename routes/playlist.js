const express = require("express");
const router = express.Router();
const mixup = require("../mixup");
const playlistData = mixup.playlist;

// router.use("/", async (req, res, next) => {
//     let userId = req.session.userId;
//     if (!userId) {
//         //user is not logged in
//         res.redirect('/user/signin');
//     }
//     else {
//         next();
//     }
// });

// to get all playlist 
router.get("/getall", async (req, res) => {
    try {
        console.log(1)
        const playlists = await playlistData.getAllPlaylistsDetails();
        res.json(playlists);
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }
});

router.get("/topFive", async (req, res) => {
    try {
        const topFivePlaylists = await playlistData.topFive();
        console.log('topFivePlaylists', topFivePlaylists)
        res.json(topFivePlaylists);
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }
});

router.post("/create", async (req, res) => {
    try {
        const playlist = await playlistData.createPlaylist(req);
        if (req.session.playlistId == null) {
            req.session.playlistId = playlist._id;
        }
        res.render('pages/createPlaylist');
    } catch (e) {
        res.render('pages/homePage', { error: e });
        console.log('err', e)
        // res.json(e)
    }
});

//to save a playlist and go back to homepage
router.get("/savePlaylist", async (req, res) => {

    try {
        await playlistData.checkPlaylistLength(req.session.playlistId);
        req.session.playlistId = null;
        res.redirect("/homePage/homePage");
    } catch (e) {
        res.render('pages/createPlaylist', { error: e });
    }




})

router.use("*", async (req, res) => {
    res.status(404).render('pages/errorAfterLogin', { title: "400 Error" });

})

module.exports = router;
