const express = require("express");
const router = express.Router();
const mixup = require("../mixup");
const songData = mixup.song;


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
/**
 * Add song to user playlist
 */
router.post("/addSong", async (req, res) => {
    try {
        const song = await songData.addSong(req);
        console.log('song', song)
        res.json(song);
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }
});

/**
 * Search song from youtube
 */
router.post("/searchSong", async (req, res) => {
    try {
        const result = await songData.searchSongYoutube(req);
        let tracksObj = [];
        result.forEach(song => {
            tracksObj.push({
                song: song.songName,
                uri: song.songURI
            })
        });

        res.status(200).render("pages/createPlaylist", { songs: tracksObj })


    } catch (e) {
        console.log('err', e)
        res.json(e)
    }

});


router.use("*", async (req, res) => {
    res.status(404).json({ error: "Page not found" });
})

module.exports = router;
