const db = require("../database");
const argon2 = require("argon2");

// Select all users
exports.users = async (req, res) => {
  const users = await db.user.findAll();

  res.json(users);
};

// Select one user by email
exports.userByEmail = async (req, res) => {
  const user = await db.user.findOne({
    where: {
      email: req.params.email,
      isDeleted: false,
    },
  });

  res.json(user);
};

// Select one user if username and password are a match.
exports.login = async (req, res) => {
  const user = await db.user.findOne({
    where: {
      email: req.query.email,
      isDeleted: false,
    },
  });

  let error;
  if (user === null) {
    error = { error: "No such user exists" };
    res.json(error);
  } else {
    if (
      (await argon2.verify(user.passwordHash, req.query.password)) === false
    ) {
      error = { error: "Incorrect email or password" };
      res.json(error);
    } else if (user.isBlocked) {
      error = { error: "The user is blocked" };
      res.json(error);
    } else {
      // if the user is found without any error
      res.json(user);
    }
  }
};

// Create a user
exports.create = async (req, res) => {
  const passwordHash = await argon2.hash(req.body.password, {
    type: argon2.argon2id,
  });

  const user = await db.user.create({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    passwordHash: passwordHash,
    dateJoined: req.body.dateJoined,
    avatarSrc: req.body.avatarSrc,
    isBlocked: req.body.isBlocked,
    secretKey: req.body.secretKey,
  });

  res.json(user);
};

// Delete a user by email (soft-delete by setting isDeleted to true)
exports.delete = async (req, res) => {
  const ret = await db.user.update(
    {
      isDeleted: true,
    },
    {
      where: { email: req.params.email },
    }
  );
  res.json(ret);
};

// Edit a user
exports.edit = async (req, res) => {
  let user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatarSrc: req.body.avatarSrc,
  };

  // If the user is editing the password as well
  if (Object.keys(req.body).includes("password")) {
    const hash = await argon2.hash(req.body.password, {
      type: argon2.argon2id,
    });
    user.passwordHash = hash;
  }

  ret = await db.user.update(user, {
    where: { email: req.body.email },
  });

  return res.json(ret);
};

// Get users by ids
exports.usersByIds = async (req, res) => {
  const ids = req.params.ids.split(",");
  let users;

  if (ids.length === 0) {
    res.json([]);
  } else {
    users = await db.user.findAll({
      where: {
        id: {
          [db.Op.or]: ids,
        },
      },
    });
  }

  res.json(users);
};
