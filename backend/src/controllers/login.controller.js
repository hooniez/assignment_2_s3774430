const db = require("../database");

// Create a new login entry in the database
exports.create = async (req, res) => {
  const loginEntry = await db.login.create({
    userId: req.params.id,
  });
  res.json(loginEntry);
};
