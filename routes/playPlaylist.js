



let status = await userData.checkSpotifyTokens(userId);
if (status === true) {
    let spotifyToken = await userData.getSpotifyToken(userId);
    try {
        const user = await userData.getUserDetailsById(req.session.userId);
        res.render("pages/homePage.handlebars", { accessToken: spotifyToken, userData: user })
    } catch (e) {
        console.log('err', e)

    }

}