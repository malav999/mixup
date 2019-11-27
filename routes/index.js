const userRoutes = require("./user");
const playlistRoutes = require("./playlist")

const constructorMethod = app => {
  app.use("/user", userRoutes);
  app.use("/playlist", playlistRoutes);
  // app.use("/likesComments", animalRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
