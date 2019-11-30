const userRoutes = require("./user");
const playlistRoutes = require("./playlist")
const spotifyRoutes = require("./spotify")

const constructorMethod = app => {
  app.use("/user", userRoutes);
  app.use("/playlist", playlistRoutes);
  app.use("/spotify", spotifyRoutes);
  // app.use("/likesComments", animalRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
