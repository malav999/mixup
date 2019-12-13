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


//Temperary just to test
router.get("/youtube", async (req, res) => {
    res.render("pages/youtube");
})

router.get("/homePage", async (req, res) => {

    let userId = req.session.userId;

    //if no session exists 
    if (!userId) {
        res.render("pages/login.handlebars")
    }



    try {
        const user = await userData.getUserDetailsById(req.session.userId);
        console.log(user);
        res.render("pages/homePage.handlebars", { userData: user })
    } catch (e) {
        console.log('err', e)

    }




})

router.post("/homePage", async (req, res) => {
    let playlistname = req.body.playlistName;

    if (playlistname)
        res.render("pages/createPlaylist", { playlistName: playlistname })
    else {
        alert("Enter playlist name");
    }
})



router.use("*", async(req,res)=>{
    res.status(404).render('pages/errorAfterLogin',{title: "400 Error"});
})

module.exports = router;