const db = require("../database");

// The value of 1 in the column reaction refers to the heart
exports.getHearterIds = async (req, res) => {
  const hearters = await db.react.findAll({
    attribute: "userId",
    where: {
      postId: req.params.id,
      reaction: 1,
    },
  });

  const heartersIds = hearters.map((entry) => entry.userId);
  res.json(heartersIds);
};

// The value of -1 in the column reaction refers to the heart
exports.getThumbDownerIds = async (req, res) => {
  const thumbDowners = await db.react.findAll({
    attribute: "userId",
    where: {
      postId: req.params.id,
      reaction: -1,
    },
  });

  const thumbDownersIds = thumbDowners.map((entry) => entry.userId);
  res.json(thumbDownersIds);
};

exports.removeReaction = async (req, res) => {
  const ret = await db.react.destroy({
    where: {
      userId: req.params.userId,
      postId: req.params.postId,
    },
  });
  res.json(ret);
};

exports.thumbDown = async (req, res) => {
  const ret = await db.react.create({
    userId: req.params.userId,
    postId: req.params.postId,
    reaction: -1,
  });
  res.json(ret);
};

exports.heart = async (req, res) => {
  const ret = await db.react.create({
    userId: req.params.userId,
    postId: req.params.postId,
    reaction: 1,
  });
  res.json(ret);
};
