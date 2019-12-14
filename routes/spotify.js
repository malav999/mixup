const express = require('express'); // Express web server framework
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const userData = require('../mixup/user.js');
const cookieParser = require('cookie-parser');
const mongodb = require('mongodb', { useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectID
const rp = require('request-promise');
const util = require('../mixup/utils');

// const collection = require('./collections');
// const tokens = collection.tokens;

// const path = require('path');
const router = express.Router();





const client_id = '65606d7237bd4225baa410676a5a6e70'; // Your client id
const client_secret = '16e6770ee5a941f69f8bba78c73b1be1'; // Your secret
const redirect_uri = 'http://localhost:3000/spotify/authorized';

router.use("/", async (req, res, next) => {
    let userId = req.session.userId;
    if (!userId) {
        //user is not logged in
        res.redirect('/user/signin');
    }
    else {
        next();
    }
});


router.get("/login", function (req, res) {

    let scope = 'streaming user-read-private user-read-email user-modify-playback-state user-read-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
        })
    );


});



router.get("/authorized", async (req, res) => {



    let code = req.query.code || null;
    if (code == null) {
        //user is not logged in
        res.redirect("/user/signin");
    }
    let userId = req.session.userId;
    //user is not logged in
    if (!userId) {
        res.redirect("/user/signin");
    }


    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    //requests the Api endpoint to acquire Access token and refresh token

    await rp.post(authOptions, async function (error, response, body) {
        //Need to make a page to show error or render if any error occurs while logging in 
        if (!error && response.statusCode === 200) {

            var access_token = body.access_token,
                refresh_token = body.refresh_token,
                timeAdded = Date.now();

            console.log(access_token);
            console.log(refresh_token);

            try {
                let addTokens = await userData.addSpotifyTokens(userId, access_token, refresh_token, timeAdded);
                //add a thing to do here after tokens are successfully added
                res.redirect('/user/signin')
            } catch (e) {
                //handle error correctly
                console.log(e);
            }

        }
        else if (error) {
            console.log(error)
        }
    });


}
);
//---------------------------------------Authorize a spotify premium user-----------------------------------------------------------------*/






//---------------------------------------Search with spotify------------------------------------------------------------------------------*/
router.post("/search", async (req, res, next) => {
    let userId = req.session.userId;
    let status = await userData.checkSpotifyTokens(userId);

    if (status === true) {
        next();
    }
    else {
        res.render('pages/APILogIn.handlebars');
    }


});


router.post("/search", async (req, res) => {

    let songToSearch = await req.body.searchBar;
    try {
        util.isString(songToSearch);
    }
    catch (e) {
        //handle if the search is not a string
    }
    let userId = req.session.userId;
    userId = ObjectId(userId);
    let spotifyToken = await userData.getSpotifyToken(userId);


    var trackGet = {
        //url: `https://api.spotify.com/v1/search?q=${songToSearch}&type=track&limit=5`
        url: `https://api.spotify.com/v1/search?` +
            querystring.stringify({
                q: songToSearch,
                type: 'track',
                limit: '10'
            }),
        headers: {
            'Authorization': `Bearer ${spotifyToken}`
        },
        json: true
    };

    try{
        await rp.get(trackGet, async function (error, response, body) {

            let answer = await response.body;
            console.log(answer);
            if (!answer.error) {
                let tracksArr = answer.tracks.items;
    
                let tracksObj = []
    
                tracksArr.forEach(song => {
    
                    tracksObj.push({
                        song: song.name,
                        uri:  song.uri
                    })
    
    
    
                });
    
    
                res.status(200).render("pages/createPlaylist", { songs: tracksObj })
            }
            
            // res.send(`<ul><li> ${tracksObj.names}</li ></ul > `)
    
    
    
        });
    }catch(e){
        console.log(e.statusCode)
        res.status(e.statusCode)
    }

    





});


//---------------------------------------Search with spotify------------------------------------------------------------------------------*/






//---------------------------------------------Play song on spotify-----------------------------------------------------------------------*/

router.post("/play/post", async (req, res, next) => {
    let userId = req.session.userId;

    let status = await userData.checkSpotifyTokens(userId);

    if (status === true) {
        next();
    }
    else {
        //user is not logged in to spotify
        res.redirect('/user/APILogIn');
    }


});





router.post("/play/", async (req, res) => {
    let userId = req.session.userId;
    let songToPlay = req.body.uri;
    //userId = ObjectId(userId);
    let spotifyToken = await userData.getSpotifyToken(userId);
    let deviceIdToPlay = "";


    var getDeviceId = {
        url: `https://api.spotify.com/v1/me/player/devices`,
        headers: {
            'Authorization': `Bearer ${spotifyToken}`
        },
        json: true
    };


    await rp.get(getDeviceId, async function (error, response, body) {
        let deviceId = await response.body;
        console.log(deviceId);
        let devicesArr = await deviceId.devices;

        for (let i = 0; i < devicesArr.length; i++) {
            console.log(devicesArr[i].name);
            if (devicesArr[i].name === "MixUp Player") {
                deviceIdToPlay = devicesArr[i].id;
                console.log(deviceIdToPlay);
                break;
            }

        }

        var playOnPlayer = {
            url: `https://api.spotify.com/v1/me/player/play?` +
                querystring.stringify({
                    device_id: deviceIdToPlay
                }),
            headers: {
                'Authorization': `Bearer ${spotifyToken}`
            },
            body: {
                uris: [songToPlay]
            },
            json: true
        };
        console.log(playOnPlayer);
        try {
            await rp.put(playOnPlayer, async function (error, response, body) {
                console.log('song is being played');

            });
        }
        catch (e) {
            console.log(e);
            res.status(e.statusCode).json({ "error": e.error.error.reason });


        }


    });

})

//---------------------------------------------Play song on spotify-----------------------------------------------------------------------*/  

router.use("*", async (req, res) => {
    res.status(404).render('pages/errorAfterLogin',{title: "400 Error"});
})

module.exports = router;

