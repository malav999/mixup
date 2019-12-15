const express = require("express");
const router = express.Router();
const mixup = require("../mixup");
const userData = mixup.user;

//to get user and user playlist's details
router.get("/get", async (req, res) => {
  try {
    const user = await userData.getUserDetailsById(req.session.userId);
    res.json(user);
  } catch (e) {
    console.log('err', e)
    res.json(e)
  }
});

//to get user and user playlist's details
router.post("/addPlaylis", async (req, res) => {
  try {
    const user = await userData.addPlaylistToUser(req);
    res.json(user);
  } catch (e) {
    console.log('err', e)
    res.json(e)
  }
});


router.get("/signin", async (req, res) => {
  if (!req.session.userId) {
    res.render('pages/login');
  }
  else {
    res.render('pages/homePage');
  }
})

router.get("/signup", async (req, res) => {
  res.render('pages/signup')
})

router.post("/signup", async (req, res) => {

  try {
    const user = await userData.addUser(req);
    res.render('pages/login')
  } catch (e) {
    // res.json(e)
    res.render('pages/signup', { error: e })
  }
  // }


});

router.post("/signin", async (req, res) => {
  try {
    const user = await userData.userSignin(req);
    //add userid in req.session 
    req.session.userId = user
    let spotifyStatus = await userData.checkSpotifyTokens(user);
    if (spotifyStatus == true) {
      res.redirect('/homePage/homePage');
    }
    else {
      res.redirect("/user/APILogIn");
    }
  } catch (e) {
    res.render('pages/login', { error: e });
  }
});



router.get("/APILogIn", async (req, res, next) => {
  let userId = req.session.userId;
  if (!userId) {
    res.redirect("/user/login");
  }
  else {
    next();
  }

})

router.get("/APILogIn", async (req, res) => {
  res.render("pages/APILogIn");
})

//to log out the user
router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/user/signin")
});

router.use("*", async (req, res) => {
  res.status(404).render('pages/error', { title: "400 Error" });

})


module.exports = router;