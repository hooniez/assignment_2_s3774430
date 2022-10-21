const db = require("../database");

const POST_LIMIT = 10;

// Select root posts
exports.rootPosts = async (req, res) => {
  const posts = await db.post.findAll({
    where: {
      parentId: null,
      isDeleted: false,
    },
    limit: POST_LIMIT,
    order: [["datePosted", "DESC"]],
    include: db.user,
  });

  res.json(posts);
};

// Select root posts made by a particular user
exports.rootPostsByUserId = async (req, res) => {
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

// Select more root posts
exports.moreRootPosts = async (req, res) => {
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

  res.json(posts);
};

// Select root posts made by a particular user
exports.moreRootPostsByUserId = async (req, res) => {
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

// Get the number of child posts by the parent post id
exports.countByParentId = async (req, res) => {
  const count = await db.post.count({
    // Find rows whose parentID is the provided id
    where: {
      parentId: req.params.id,
      isDeleted: false,
    },
  });

  res.json(count);
};

// Create a new post
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

// Delete a post by id
exports.delete = async (req, res) => {
  const ret = await db.post.update(
    {
      isDeleted: true,
    },
    { where: { id: req.params.id } }
  );
  res.json(ret);
};

// Edit an existing post
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
exports.comments = async (req, res) => {
  const comments = await db.post.findAll({
    where: {
      parentId: req.params.id,
      isDeleted: false,
    },
    limit: POST_LIMIT,
    include: db.user,
  });

  res.json(comments);
};

exports.moreComments = async (req, res) => {
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

  res.json(posts);
};

// exports.totalCountById = async (req, res) => {
//   // console.log(req.params.id);
//   const count = await db.post.count({
//     where: {
//       postedBy: Number(req.params.id),
//       parentId: null,
//       isDeleted: false,
//     },
//   });
//   res.json(count);
// };
