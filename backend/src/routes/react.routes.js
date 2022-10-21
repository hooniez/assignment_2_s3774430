module.exports = (express, app) => {
  const controller = require("../controllers/react.controller.js");
  const router = express.Router();

  // Get the ids of users who have given a heart reaction to the post
  router.get("/hearters/:id", controller.hearterIds);
  // Get the ids of users who have given a thumbdown reaction to the post
  router.get("/thumbdowners/:id", controller.thumbdownerIds);
  // Remove an entry
  router.delete("/removeReaction/:userId/:postId", controller.removeReaction);
  // Create an entry for a thumbdown
  router.post("/thumbdown/:userId/:postId", controller.thumbdown);
  // Create an entry for a heart
  router.post("/heart/:userId/:postId", controller.heart);

  app.use("/api/reacts", router);
};
