const db = require("../database");

// Select all root posts from the database.
exports.new = async (req, res) => {
  const posts = await db.post.findAll({
    where: {
      parentId: null,
      isDeleted: false,
    },
    limit: 5,
    order: [["datePosted", "DESC"]],
    include: db.user,
  });

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(posts);
};

exports.moreNewPosts = async (req, res) => {
  const existingIds = req.params.existingIds.split(",");

  const posts = await db.post.findAll({
    where: {
      parentId: null,
      isDeleted: false,
      id: { [db.Op.notIn]: existingIds },
    },
    limit: 10,
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
    where: {
      parentId: req.params.id,
      isDeleted: false,
    },
  });
  res.json(count);
};

exports.delete = async (req, res) => {
  const ret = await db.post.update(
    {
      isDeleted: true,
    },
    { where: { id: req.params.id } }
  );
  res.json(ret);
};

exports.edit = async (req, res) => {
  const editedPost = await db.post
    .update(
      {
        text: req.body.text,
        imgSrc: req.body.imgSrc,
      },
      {
        where: { id: req.body.id },
      }
    )
    .then(() => {
      return db.post.findByPk(req.body.id, {
        include: db.user,
      });
    })
    .then((post) => {
      console.log(post);
      res.json(post);
    });
};

// Select comments from the database.
exports.newComments = async (req, res) => {
  const comments = await db.post.findAll({
    where: {
      parentId: req.params.id,
      isDeleted: false,
    },
    limit: 5,
    include: db.user,
  });

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(comments);
};

exports.moreNewComments = async (req, res) => {
  const existingIds = req.params.existingIds.split(",");

  const posts = await db.post.findAll({
    where: {
      parentId: req.params.id,
      isDeleted: false,
      id: { [db.Op.notIn]: existingIds },
    },
    limit: 5,
    include: db.user,
  });

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(posts);
};
