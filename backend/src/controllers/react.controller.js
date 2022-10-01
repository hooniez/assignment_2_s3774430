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
