const express = require("express");
const router = express.Router();
const userData = require('../mixup/user');
const util = require('../mixup/utils');
const playlist = require('../mixup/playlist');



//To check if user has logged in 
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
//renders the CreatePlaylist page
router.get("/createPlaylist", async (req, res) => {
    res.render('pages/createPlaylist');
})

// creating a new playlist
router.post("/create", async (req, res) => {
    let songToSearch = req.body.searchBar;


    //To check if songToSearch is of type String

    try {
        util.isString(songToSearch);
    } catch (e) {
        res.json(e);
    }


});

module.exports = router;