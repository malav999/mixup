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

router.get("/signin", async (req, res) => {

  res.render('pages/login')

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
    res.redirect('/homePage/homePage');
  } catch (e) {
    res.render('pages/login', { error: e });
  }
});



router.get("/APILogIn", async (req, res, next) => {
  let userId = req.session.userId;
  if (!userId) {
    res.redirect("/playlist/create");
  }
  else {
    next();
  }

})

router.get("/APILogIn", async (req, res) => {
  res.render("pages/APILogIn");
})

router.use("*", async (req, res) => {
  res.status(404).render('pages/error', { title: "400 Error" });

})


module.exports = router;