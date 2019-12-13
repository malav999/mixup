const express = require("express");
const router = express.Router();
const mixup = require("../mixup");
const userData = mixup.user;

//to get user's playlist 
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
  let signUpData = req.body;
  let errors = [];

  if (!signUpData.firstName) {
    errors.push("No firstname provided");
  }

  if (!signUpData.lastName) {
    errors.push("No lastname provided");
  }
  // !signUpData.male && !signUpData.female && !signUpData.other
  // if (!signUpData.gender) {
  //   errors.push("No gender provided");
  // }

  // if (!signUpData.dob) {
  //   errors.push("No D.O.B provided");
  // }

  if (!signUpData.email) {
    errors.push("No E-mail provided");
  }

  if (!signUpData.password) {
    errors.push("No password provided");
  }

  if (!signUpData.confirmPassword) {
    errors.push("No confirm password provided");
  }

  if (signUpData.password != signUpData.confirmPassword) {
    errors.push("Confirm Password does not match with password");
  }

  if (errors.length > 0) {
    res.render("pages/signup", {
      errors: errors,
      hasErrors: true,
      post: signUpData
    });

  }
  else {
    try {
      const user = await userData.addUser(req);
      res.render('pages/login')
    } catch (e) {
      res.json(e)
    }
  }


});

router.post("/signin", async (req, res) => {
  try {
    const user = await userData.userSignin(req);
    //add userid in req.session 
    req.session.userId = user
    res.redirect('/homePage/homePage');
  } catch (e) {
    res.render('pages/login', { error: e })
  }


});

router.get("/APILogIn", async (req, res, next) => {
  let userId = req.session.userId;
  if (!userId) {
    res.redirect("/user/signin");
  }
  else {
    next();
  }

})

router.get("/APILogIn", async (req, res) => {
  res.render("pages/APILogIn");
})

router.use("*", async (req, res) => {
  res.status(404).json({ error: "Page not found" });
})


module.exports = router;