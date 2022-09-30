module.exports = (express, app) => {
  const controller = require("../controllers/follow.controller.js");
  const router = express.Router();

  // Create a new follow entry
  router.post("/:followingEmail/:followedEmail", controller.create);

  // Delete a follow entry
  router.delete("/:followingEmail/:followedEmail", controller.delete);

  // Get all the users whom the logged-in user follows
  router.get("/getAllFollowing/:id", controller.getAllFollowing);

  // Get all users who are following the logged-in user
  router.get("/getAllFollowers/:id", controller.getAllFollowers);

  // Add routes to server.
  app.use("/api/follows", router);
};
