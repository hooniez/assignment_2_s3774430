module.exports = (express, app) => {
  const controller = require("../controllers/login.controller.js");
  const router = express.Router();

  // Create a new login entry
  router.post("/:id", controller.create);

  // Add routes to server.
  app.use("/api/logins", router);
}