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
        console.log('playlist', playlist)
        res.json(playlist);
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }
});


router.use("*", async(req,res)=>{
    res.status(404).json({error:"Page not found"});
})

module.exports = router;
