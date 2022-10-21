module.exports = (express, app) => {
  const controller = require("../controllers/user.controller.js");
  const router = express.Router();

  // Select all users.\
  router.get("/", controller.users);

  // Select one user by email
  router.get("/select/:email", controller.userByEmail);

  // Select one user if username and password are a match
  router.get("/login", controller.login);

  // Create a user
  router.post("/", controller.create);

  // Delete a user by email
  router.delete("/delete/:email", controller.delete);

  // Edit a user
  router.put("/", controller.edit);

  // Get users by ids
  router.get("/:ids", controller.usersByIds);

  // Add routes to server.
  app.use("/api/users", router);
};
