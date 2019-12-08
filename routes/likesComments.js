const express = require("express");
const router = express.Router();
const mixup = require("../mixup");
const likesCommentsData = mixup.likesComments;

console.log(1)
// router.use("/", async (req, res, next) => {
//     let userId = req.session.userId;
//     if (!userId) {
//         //user is not logged in
//         res.redirect('/user/signin');
//     }
//     else {
//         next();
//     }
// });

router.post("/addLike", async (req, res) => {
    console.log(2)
    try {
        const likesComments = await likesCommentsData.addLike(req);
        console.log('likesComments', likesComments)
        res.json(likesComments);
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }
});

router.post("/addComment", async (req, res) => {
    console.log(2)
    try {
        const likesComments = await likesCommentsData.addComment(req);
        console.log('likesComments', likesComments)
        res.json(likesComments);
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }
});


router.use("*", async (req, res) => {
    res.status(404).json({ error: "Page not found" });
})

module.exports = router;
