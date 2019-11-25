const userRoutes = require("./user");

const constructorMethod = app => {
  console.log(1)
  app.use("/user", userRoutes);
  // app.use("/playlist", animalRoutes);
  // app.use("/likesComments", animalRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
