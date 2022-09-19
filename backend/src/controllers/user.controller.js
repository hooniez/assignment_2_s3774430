const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.user.findAll();

  res.json(users);
};

// Select one user from the database.
exports.one = async (req, res) => {
  const user = await db.user.findByPk(req.params.email);

  res.json(user);
};

// Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
  const user = await db.user.findByPk(req.query.email);

  if (
    user === null ||
    (await argon2.verify(user.passwordHash, req.query.password)) === false
  )
    // Login failed.
    res.json(null);
  else res.json(user);
};

// Create a user in the database.
exports.create = async (req, res) => {
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

  const user = await db.user.create({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    passwordHash: hash,
    dateJoined: req.body.dateJoined,
    avatarSrc: req.body.avatarSrc,
    isBlocked: req.body.isBlocked,
    secretKey: req.body.secretKey,
  });

  res.json(user);
};

// Delete a user from the table
exports.delete = async (req, res) => {
  await db.user.destroy({
    where: { email: req.params.email },
  });
};

exports.edit = async (req, res) => {
  console.log(req.body);
  let user;

  if (Object.keys(req.body).includes("password")) {
    console.log("includes");
    const hash = await argon2.hash(req.body.password, {
      type: argon2.argon2id,
    });

    user = await db.user.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatarSrc: req.body.avatarSrc,
        passwordHash: hash,
      },
      {
        where: { email: req.body.email },
      }
    );
  } else {
    console.log("doesn't include");
    user = await db.user.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatarSrc: req.body.avatarSrc,
      },
      {
        where: { email: req.body.email },
      }
    );
  }
  return res.json(user);
};
