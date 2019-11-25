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
    res.json(user);
  } catch (e) {
    res.json(e)
  }
});

module.exports = router;
