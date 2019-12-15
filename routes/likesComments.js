const express = require("express");
const router = express.Router();
const mixup = require("../mixup");
const likesCommentsData = mixup.likesComments;


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

router.get("/addLike/:pId", async (req, res) => {
    try {
        const likesComments = await likesCommentsData.addLike(req);
        console.log('likesComments', likesComments)
        res.redirect("/playlist/getall");
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }
});

router.get("/addComment/:pId", async (req, res) => {
    try {
        const likesComments = await likesCommentsData.addComment(req);
        console.log('likesComments', likesComments)
        res.redirect("/playlist/getall");
    } catch (e) {
        console.log('err', e)
        res.json(e)
    }
});


router.use("*", async (req, res) => {
    res.status(404).render('pages/errorAfterLogin', { title: "400 Error" });
})

module.exports = router;
