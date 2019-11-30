const express = require('express'); // Express web server framework
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const userData = require('../mixup/user.js');
const cookieParser = require('cookie-parser');
const mongodb = require('mongodb',{ useUnifiedTopology: true});

// const collection = require('./collections');
// const tokens = collection.tokens;

// const path = require('path');
const router = express.Router();





const client_id = '65606d7237bd4225baa410676a5a6e70'; // Your client id
const client_secret = '16e6770ee5a941f69f8bba78c73b1be1'; // Your secret
const redirect_uri = 'http://localhost:3000/spotify/homePage'; 

// var generateRandomString = function(length) {
//     var text = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
//     for (var i = 0; i < length; i++) {
//       text += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return text;
// };

//var stateKey = 'spotify_auth_state';


/**
 * Have your application request authorization; the user logs in and authorizes access
 */



//---------------------------------------Authorize a spotify premium user-----------------------------------------------------------------*/
router.get("/login", function(req,res) {

    let scope = 'streaming user-read-private user-read-email user-modify-playback-state user-read-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' + 
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            //state: state   
        }));


});


//Temporary homepage and request for AccessToken refresh token
router.get("/homePage", async(req,res)=>{

    let code = req.query.code || null;
    let userId = req.session.userId;
    
    
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
    request.post(authOptions, async function(error, response, body) {
        //Need to make a page to show error or render if any error occurs while logging in 
        if (!error && response.statusCode === 200) {
  
        var access_token = body.access_token, 
        refresh_token = body.refresh_token;
            
        console.log(access_token);
        console.log(refresh_token);
        
        try{
            let addTokens = await userData.addSpotifyTokens(userId,access_token,refresh_token);
            //add a thing to do here after tokens are successfully added
            res.render('pages/homepage')
        }catch(e){
            //handle error correctly
            console.log(e);
        }
    
        }        
    });
    

    }
);
//---------------------------------------Authorize a spotify premium user-----------------------------------------------------------------*/

    router.post("/search", async(req,res)=>{
        
    });


//---------------------------------------Search with spotify------------------------------------------------------------------------------*/





// make page for redirect url

module.exports = router;

