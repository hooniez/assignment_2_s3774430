const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  Op: Sequelize.Op,
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
});

// Include models.
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.post = require("./models/post.js")(db.sequelize, DataTypes);
db.follow = require("./models/follow.js")(db.sequelize, DataTypes);
db.react = require("./models/react.js")(db.sequelize, DataTypes);

// One user can have many posts while each post belongs to one user
db.user.hasMany(db.post, {
  foreignKey: "postedBy",
});
db.post.belongsTo(db.user, {
  foreignKey: "postedBy",
});

// Use the function table db.follow in a self-referential relationship
db.user.belongsToMany(db.user, {
  as: "followed",
  through: db.follow,
});

// Associate user with post through the react table
db.user.belongsToMany(db.post, { through: db.react });
db.post.belongsToMany(db.user, { through: db.react });

// Create a junction table called Follow to keep track of who follows whom

// Learn more about associations here: https://sequelize.org/master/manual/assocs.html

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  // await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true });
  await db.sequelize.sync({ force: true });

  await seedData();
};

async function seedData() {
  let userExists = (await db.user.count()) > 0;

  if (!userExists) {
    const argon2 = require("argon2");

    let hash = await argon2.hash("abcDEF1!", { type: argon2.argon2id });
    await db.user.create({
      email: "myeonghoon@gmail.com",
      firstName: "Myeonghoon",
      lastName: "Sun",
      avatarSrc:
        "https://avatars.dicebear.com/api/bottts/0.7036963182906151.svg",
      passwordHash: hash,
    });

    hash = await argon2.hash("abcDEF1!", { type: argon2.argon2id });
    await db.user.create({
      email: "hara@gmail.com",
      firstName: "Hara",
      lastName: "Sun",
      avatarSrc:
        "https://avatars.dicebear.com/api/adventurer/0.8556760661642577.svg",
      passwordHash: hash,
      isDeleted: true,
    });

    hash = await argon2.hash("abcDEF1!", { type: argon2.argon2id });
    await db.user.create({
      email: "jihoon@gmail.com",
      firstName: "Jihoon",
      lastName: "Sun",
      avatarSrc: "https://avatars.dicebear.com/api/micah/0.940096983925274.svg",
      isBlocked: false,
      passwordHash: hash,
    });

    hash = await argon2.hash("abcDEF1!", { type: argon2.argon2id });
    await db.user.create({
      email: "hwangkyu@gmail.com",
      firstName: "Hwangkyu",
      lastName: "Sun",
      avatarSrc: "https://avatars.dicebear.com/api/micah/0.940096983925273.svg",
      isBlocked: false,
      passwordHash: hash,
    });
  }

  let postExists = (await db.post.count()) > 0;

  if (!postExists) {
    await db.post.create({
      postedBy: 1,
      parentId: null,
      text: "Hello, my name is Myeonghoon",
      datePosted: "2022-09-30 05:14:01",
    });

    await db.post.create({
      postedBy: 1,
      parentId: null,
      text: "Hello again",
      datePosted: "2022-09-30 05:14:02",
    });

    await db.post.create({
      postedBy: 2,
      parentId: 1,
      text: "Hello Myeonghoon, my name is Hara",
      datePosted: "2022-09-30 05:14:03",
    });

    await db.post.create({
      postedBy: 3,
      parentId: null,
      text: "Hello world, i'm Jihoon",
      datePosted: "2022-09-30 05:14:04",
    });

    await db.post.create({
      postedBy: 3,
      parentId: 1,
      text: "Hello, Myeonghoon. I'm Jihoon",
      datePosted: "2022-09-30 05:14:05",
    });

    await db.post.create({
      postedBy: 4,
      parentId: null,
      text: "Hello, my name is Hwangkyu",
      datePosted: "2022-09-30 05:14:06",
    });

    await db.post.create({
      postedBy: 1,
      parentId: null,
      text: "Just had so much sundae and now I'm going to just work until I fall asleep",
      datePosted: "2022-09-30 05:14:07",
    });

    await db.post.create({
      postedBy: 1,
      parentId: null,
      text: "I've been posting so many posts and no one's going to emulate my pace",
      datePosted: "2022-09-30 05:14:08",
    });

    await db.post.create({
      postedBy: 1,
      parentId: null,
      text: "I can feel the summer heat creeping in as I'm typing away",
      datePosted: "2022-09-30 05:14:09",
    });

    await db.post.create({
      postedBy: 1,
      parentId: null,
      text: "CT is screaming in background for attention",
      datePosted: "2022-09-30 05:14:10",
    });

    await db.post.create({
      postedBy: 1,
      parentId: null,
      text: "Hmm, my eyes are hurting so much from staring into the monitor",
      datePosted: "2022-09-30 05:14:11",
    });

    await db.post.create({
      postedBy: 1,
      parentId: null,
      text: "Is there a reason why I'm posting so many posts like I'm schizophreniac? yes, to see the effects of infinite scrolling",
      datePosted: "2022-09-30 05:14:12",
    });

    await db.post.create({
      postedBy: 1,
      parentId: null,
      text: "Welcome to the social media built to broadcast my thoughts",
      datePosted: "2022-09-30 05:14:12",
    });
  }

  let followExists = (await db.follow.count()) > 0;

  if (!followExists) {
    await db.follow.create({
      userId: 1,
      followedId: 3,
    });

    await db.follow.create({
      userId: 1,
      followedId: 4,
    });

    await db.follow.create({
      userId: 3,
      followedId: 1,
    });

    await db.follow.create({
      userId: 3,
      followedId: 4,
    });
  }

  let reactionExists = (await db.react.count()) > 0;
  if (!reactionExists) {
    await db.react.create({
      userId: 1,
      postId: 1,
      reaction: 1,
    });
    await db.react.create({
      userId: 3,
      postId: 1,
      reaction: 1,
    });
    await db.react.create({
      userId: 4,
      postId: 1,
      reaction: -1,
    });
  }
}

module.exports = db;
