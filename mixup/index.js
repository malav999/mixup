const userData = require("./user");
const playlistData = require("./playlist");
const songData = require("./song");
const likesCommentsData = require("./likesComments");

module.exports = {
  user: userData,
  playlist: playlistData,
  song: songData,
  likesComments: likesCommentsData
};
