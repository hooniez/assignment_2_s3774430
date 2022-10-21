const db = require("../database");

// Create a new follow entry in the database
exports.create = async (req, res) => {
  // Find the two users involved in this new follow entry to be created
  const followingUser = await db.user.findOne({
    attribute: "id",
    where: {
      email: req.params.followingEmail,
    },
  });
  const followedUser = await db.user.findOne({
    attribute: "id",
    where: {
      email: req.params.followedEmail,
    },
  });

  // Create a new entry
  const followEntry = await db.follow.create({
    userId: followingUser.id,
    followedId: followedUser.id,
  });
  res.json(followEntry);
};

// Delete a follow entry
exports.delete = async (req, res) => {
  // Find the two users involved in this follow entry to be deleted
  const followingUser = await db.user.findOne({
    attribute: "id",
    where: {
      email: req.params.followingEmail,
    },
  });
  const followedUser = await db.user.findOne({
    attribute: "id",
    where: {
      email: req.params.followedEmail,
    },
  });

  // Delete the entry
  const followEntry = await db.follow.destroy({
    where: {
      userId: followingUser.id,
      followedId: followedUser.id,
    },
  });
  res.json(followEntry);
};

// Get the ids of all the users whom the logged-in user follows
exports.getAllFollowing = async (req, res) => {
  const following = await db.follow.findAll({
    attribute: "followedId",
    where: {
      userId: req.params.id,
    },
  });

  const followingIds = following.map((entry) => entry.followedId);

  res.json(followingIds);
};

// Get all users who are following the logged-in user
exports.getAllFollowers = async (req, res) => {
  const followers = await db.follow.findAll({
    attribute: "userId",
    where: {
      followedId: req.params.id,
    },
  });

  const followersIds = followers.map((entry) => entry.userId);

  res.json(followersIds);
};
