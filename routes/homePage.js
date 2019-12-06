const express = require("express");
const router = express.Router();
const userData = require('../mixup/user')


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

module.exports = router;