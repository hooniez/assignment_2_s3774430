const db = require("../database");

const POST_LIMIT = 10;

// Select all root posts from the database.
exports.new = async (req, res) => {
  const posts = await db.post.findAll({
    where: {
      parentId: null,
      isDeleted: false,
    },
    limit: POST_LIMIT,
    order: [["datePosted", "DESC"]],
    include: db.user,
  });

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(posts);
};

exports.newByUserId = async (req, res) => {
  const posts = await db.post.findAll({
    where: {
      postedBy: Number(req.params.userId),
      parentId: null,
      isDeleted: false,
    },
    limit: POST_LIMIT,

    order: [["datePosted", "DESC"]],
    include: db.user,
  });

  res.json(posts);
};

exports.moreNewPosts = async (req, res) => {
  const posts = await db.post.findAll({
    where: {
      parentId: null,
      isDeleted: false,
    },
    limit: POST_LIMIT,
    offset: Number(req.params.offset),
    order: [["datePosted", "DESC"]],
    include: db.user,
  });

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(posts);
};

exports.moreNewPostsByUserId = async (req, res) => {
  const posts = await db.post.findAll({
    where: {
      postedBy: Number(req.params.userId),
      parentId: null,
      isDeleted: false,
    },
    limit: POST_LIMIT,
    offset: Number(req.params.offset),
    order: [["datePosted", "DESC"]],
    include: db.user,
  });

  res.json(posts);
};

exports.totalCountById = async (req, res) => {
  // console.log(req.params.id);
  const count = await db.post.count({
    where: {
      postedBy: Number(req.params.id),
      parentId: null,
      isDeleted: false,
    },
  });
  res.json(count);
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
    limit: POST_LIMIT,
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
    limit: POST_LIMIT,
    include: db.user,
  });

  // Can use eager loading to join tables if needed, for example:
  // const posts = await db.post.findAll({ include: db.user });

  // Learn more about eager loading here: https://sequelize.org/master/manual/eager-loading.html

  res.json(posts);
};
