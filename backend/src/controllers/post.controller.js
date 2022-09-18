const db = require("../database");

// Select all root posts from the database.
exports.all = async (req, res) => {
  const posts = await db.post.findAll({
    where: {
      parentId: null,
      isDeleted: false,
    },
    limit: 4,
    order: [["datePosted", "DESC"]],
    include: db.user,
  });

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(posts);
};

// Create a post in the database.
exports.create = async (req, res) => {
  const newPost = await db.post.create({
    postedBy: req.body.postedBy,
    parentId: req.body.parentId,
    text: req.body.text,
    imgSrc: req.body.imgSrc,
  });
  const newPostWithUser = await db.post.findByPk(newPost.id, {
    include: db.user,
  });

  res.json(newPostWithUser);
};

exports.countById = async (req, res) => {
  const count = await db.post.count({
    // Find rows whose parentID is the provided id
    where: { parentId: req.params.id },
  });
  res.json(count);
};

exports.delete = async (req, res) => {
  const ret = await db.post.destroy({
    where: { id: req.params.id },
  });
  res.json(ret);
};
