const express = require("express");
const router = express.Router();
const mixup = require("../mixup");
const userData = mixup.user;

router.post("/signup", async (req, res) => {
  try {
    const user = await userData.addUser(req);
    res.json(user);
  } catch (e) {
    res.json(e)
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await userData.userSignin(req);
    //add userid in req.session 
    req.session.userId = user
  } catch (e) {
    res.json(e)
  }


  try{
     //Need to check if access token and refresh token exists otherwise render log in page
    if(await userData.checkSpotifyTokens(req.session.userId) == false){
      //render the API log in page 
      res.render('/pages/APILogIn');
     }
    else{
      res.render('/pages/homePage')
    }
  }
  catch(e){
    console.log(e);
  }
});

module.exports = router;
