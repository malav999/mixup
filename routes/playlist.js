const express = require("express");
const router = express.Router();
const mixup = require("../mixup");
const playlistData = mixup.playlist;


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

router.post("/create", async (req, res) => {
    try {
        const playlist = await playlistData.createPlaylist(req);
        if (req.session.playlistId == null) {
            req.session.playlistId = playlist._id;
        }
        res.render('pages/createPlaylist');
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }
});

//to save a playlist and go back to homepage
router.get("/savePlaylist", async (req, res) => {

    try{
        await playlistData.checkPlaylistLength(req.session.playlistId);
        req.session.playlistId = null;
        res.redirect("/homePage/homePage");
    }catch(e){
        res.render('pages/createPlaylist', {error: e});
    }
    

    
   
})


router.use("*", async (req, res) => {
    res.status(404).json({ error: "Page not found" });
})

module.exports = router;
