const express = require("express");
const router = express.Router();
const userData = require('../mixup/user')



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

    let status = await userData.checkSpotifyTokens(userId);
    if (status === true) {
        let spotifyToken = await userData.getSpotifyToken(userId);
        try {
            const user = await userData.getUserDetailsById(req.session.userId);
            res.render("pages/playPlaylist", { accessToken: spotifyToken})
        } catch (e) {
            console.log('err', e)

        }

    }
    else{
        res.render("pages/playPlaylist");
    }
})




router.use("*", async (req, res) => {
    res.status(404).json({ error: "Page not found" });
})

module.exports = router;


