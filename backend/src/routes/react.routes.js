module.exports = (express, app) => {
  const controller = require("../controllers/react.controller.js");
  const router = express.Router();

  router.get("/hearters/:id", controller.getHearterIds);
  router.get("/thumbdowners/:id", controller.getThumbDownerIds);

  app.use("/api/reacts", router);
};