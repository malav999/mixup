# MixUp

Group 20: for CS 546 B  
Group Members: Aneri Shah, Dhruval Thakkar, Mahir Dhall, Malav Shah

This web application can be used to create and play cross-platform playlists using two music streaming services, Spotify and youtube. A user can also like, comment, add and play other user's playlists using MixUp.

### Prerequisites

1. Spotify API requires Google chrome web browser.
2. The user will need a Spotify 'premium account' in order to play songs on Spotify API and access     our website. 
3. Please pause all advertisment and pop up blocker extensions on the web browser for better           expereince.

### Installing

Steps to take once file is downloaded on the local machine:

Install all npm package modules
Step 1: npm install
To populate the database with data
Step 2: npm run seed
To start the server at http://localhost:3000 
Step 3: npm start

## Running the tests

1. In order to test the application, we've created a user with the following credentials:
   Email: phill@gmail.com
   Password: hello1234

   This user already contains valid access and refresh token for Spotify so authentication with spotify is not required for this particular test. 

   This user has two existing playlists that can be used to test the play feature. Few more dummy users have been added with their respective playlists to test the dicover page where you can like, comment or add another user's playlist into your own list.

2. In order to test the sign-up route, user will be redirected to Spotify API log in page. A           premium Spotify account is required to access the website and all its functionality. 

3. While creating a new playlist, search bar is provided with two buttons to search either on          Youtube or Spotify. Youtube search has been limited to 20 songs with static data seeded in the      database. A list is given below for the same.

4. For testing purposes and convenience, youtube audio will end in 1 minute interval and the next song in the playlist will be played. Spotify music can be controlled using any other device with same account.
    


### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```



## Authors





