module.exports = (express, app) => {
  const controller = require("../controllers/post.controller.js");
  const router = express.Router();

  // Select root posts.
  router.get("/", controller.rootPosts);

  // Select more root posts
  router.get("/moreNew/:offset", controller.moreRootPosts);

  // Select root posts by userId.
  router.get("/:userId", controller.rootPostsByUserId);

  // Select more root posts by userId
  router.get("/:userId/moreNew/:offset", controller.moreRootPostsByUserId);

  // Get the number of child posts by the parent post id
  router.get("/count/:id", controller.countByParentId);

  // Create a new post
  router.post("/", controller.create);

  // Delete a post by id
  router.delete("/delete/:id", controller.delete);

  // Edit an existing post
  router.put("/", controller.edit);

  // Select comments
  router.get("/:id/comments", controller.comments);

  // Select more comments
  router.get("/:id/moreNew/:existingIds", controller.moreComments);

  // Add routes to server.
  app.use("/api/posts", router);
};
