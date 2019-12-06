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

router.get("/homePage", async(req,res)=>{
    
    let userId = req.session.userId;

    //if no session exists 
    if(!userId){
        res.render("pages/login.handlebars")
    }
    try{
        let status = await userData.checkSpotifyTokens(userId);
        if(status === true){
            let spotifyToken = await userData.getSpotifyToken(userId);
            res.render("pages/homePage.handlebars",{accessToken:spotifyToken})
        }
        else{
            res.render("pages/homePage.handlebars")
        }
    }catch(e){
        //handle error
    }
    
    
})


router.use("*", async(req,res)=>{
    res.status(404).json({error:"Page not found"});
})

module.exports = router;