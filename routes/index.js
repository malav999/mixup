const userRoutes = require("./user");
const playlistRoutes = require("./playlist")
const spotifyRoutes = require("./spotify")
const songRoutes = require("./song")
const homePageRoutes = require("./homePage")
const likesCommentsRoutes = require("./likesComments")
const createPlaylistRoutes = require("./createPlaylist")


const constructorMethod = app => {
  app.use("/user", userRoutes);
  app.use("/playlist", playlistRoutes);
  app.use("/spotify", spotifyRoutes);
  app.use("/song", songRoutes);
  app.use("/homePage", homePageRoutes);
  app.use("/likesComments", likesCommentsRoutes);
  app.use("/createPlaylist", createPlaylistRoutes);
  app.use("*", (req, res) => {
    res.status(404).render('pages/error',{title: "400 Error"});
  });
};

module.exports = constructorMethod;
