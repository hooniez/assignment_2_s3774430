module.exports = (express, app) => {
  const controller = require("../controllers/post.controller.js");
  const router = express.Router();

  // Select new posts.
  router.get("/", controller.new);

  // Select new posts by userId.
  router.get("/:userId", controller.newByUserId);

  // Select more new posts
  router.get("/moreNew/:offset", controller.moreNewPosts);

  // Select more new posts by userId
  router.get("/:userId/moreNew/:offset", controller.moreNewPostsByUserId);

  // Get the number of child posts by the parent post id
  router.get("/count/:id", controller.countById);

  // Create a new post.
  router.post("/", controller.create);

  // Delete a post by id.
  router.delete("/delete/:id", controller.delete);

  // Edit an existing post
  router.put("/", controller.edit);

  // Select new comments
  router.get("/:id/comments", controller.newComments);

  // Select more new posts
  router.get("/:id/moreNew/:existingIds", controller.moreNewComments);

  // API_HOST + `/api/posts/${id}/moreNew/${existingIds}`

  // Add routes to server.
  app.use("/api/posts", router);
};
