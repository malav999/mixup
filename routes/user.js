const express = require("express");
const router = express.Router();
const mixup = require("../mixup");
const userData = mixup.user;




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
  res.redirect('/homePage/homePage');

});

router.get("/APILogIn", async(req,res,next)=>{
  let userId = req.session.userId;
  if(!userId){
    res.redirect("/user/signin");
  }
  else{
    next();
  }
 
})
router.get("/APILogIn", async(req,res)=>{
  res.render("pages/APILogIn");
})

router.use("*", async(req,res)=>{
  res.status(404).json({error:"Page not found"});
})



module.exports = router;
