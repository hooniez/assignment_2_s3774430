module.exports = (express, app) => {
  const controller = require("../controllers/react.controller.js");
  const router = express.Router();

  // Get all the ids of users who have hearted the post
  router.get("/hearters/:id", controller.getHearterIds);
  // Get all the ids of users who have thumbed down the post
  router.get("/thumbdowners/:id", controller.getThumbDownerIds);
  // Remove an entry
  router.delete("/removeReaction/:userId/:postId", controller.removeReaction);
  // Create an entry for a thumbdown
  router.post("/thumbdown/:userId/:postId", controller.thumbDown);
  // Create an entry for a heart
  router.post("/heart/:userId/:postId", controller.heart);


  app.use("/api/reacts", router);
};