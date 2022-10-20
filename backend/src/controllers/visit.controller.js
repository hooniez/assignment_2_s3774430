const db = require("../database");

// Create a new visit entry in the database
exports.create = async (req, res) => {
  console.log(req.params);
  const visitingUser = await db.user.findOne({
    attribute: "id",
    where: {
      email: req.params.visitingEmail,
    },
  });
  const visitedUser = await db.user.findOne({
    attribute: "id",
    where: {
      email: req.params.visitedEmail,
    },
  });

  const visitEntry = await db.visit.create({
    userId: visitingUser.id,
    visitedId: visitedUser.id,
    dateVisited: Date.now(),
  });
  res.json(visitEntry);
};
