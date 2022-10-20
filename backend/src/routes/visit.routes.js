module.exports = (express, app) => {
  const controller = require("../controllers/visit.controller.js");
  const router = express.Router();

  // Create a new visit entry
  router.post("/:visitingEmail/:visitedEmail", controller.create);

  // Add routes to server.
  app.use("/api/visits", router);
};
