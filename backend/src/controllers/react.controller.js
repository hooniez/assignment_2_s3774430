const db = require("../database");

const Reactions = {
  Heart: 1,
  Thumbdown: -1,
};

// Get the ids of users who have given a heart reaction to the post
exports.hearterIds = async (req, res) => {
  const hearters = await db.react.findAll({
    attribute: "userId",
    where: {
      postId: req.params.id,
      reaction: Reactions.Heart,
    },
  });

  const heartersIds = hearters.map((entry) => entry.userId);
  res.json(heartersIds);
};

// Get the ids of users who have given a thumbdown reaction to the post
exports.thumbdownerIds = async (req, res) => {
  const thumbdowners = await db.react.findAll({
    attribute: "userId",
    where: {
      postId: req.params.id,
      reaction: Reactions.Thumbdown,
    },
  });

  const thumbdownersIds = thumbdowners.map((entry) => entry.userId);
  res.json(thumbdownersIds);
};

// Remove an entry
exports.removeReaction = async (req, res) => {
  const ret = await db.react.destroy({
    where: {
      userId: req.params.userId,
      postId: req.params.postId,
    },
  });
  res.json(ret);
};

// Create an entry for a thumbdown
exports.thumbdown = async (req, res) => {
  const ret = await db.react.create({
    userId: req.params.userId,
    postId: req.params.postId,
    reaction: Reactions.Thumbdown,
  });
  res.json(ret);
};

// Create an entry for a heart
exports.heart = async (req, res) => {
  const ret = await db.react.create({
    userId: req.params.userId,
    postId: req.params.postId,
    reaction: Reactions.Heart,
  });
  res.json(ret);
};
