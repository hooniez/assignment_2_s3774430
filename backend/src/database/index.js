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

// One user can have many posts while each post belongs to one user
db.user.hasMany(db.post, {
  foreignKey: "postedBy",
});

db.post.belongsTo(db.user, {
  foreignKey: "postedBy",
});

// Learn more about associations here: https://sequelize.org/master/manual/assocs.html

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  // await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.

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
      isBlocked: true,
      passwordHash: hash,
    });
  }

  let postExists = (await db.post.count()) > 0;

  if (!postExists) {
    await db.post.create({
      id: 1,
      postedBy: 1,
      parentId: null,
      text: "Hello, my name is sk",
    });

    await db.post.create({
      postedBy: 1,
      parentId: null,
      text: "Hello again",
    });

    await db.post.create({
      postedBy: 2,
      parentId: 1,
      text: "Hello sk, i'm bolger",
    });

    await db.post.create({
      postedBy: 3,
      parentId: null,
      text: "Hello world, i'm the T",
    });

    await db.post.create({
      id: 5,
      postedBy: 3,
      parentId: 1,
      text: "Hello sk, i'm bolger, but with a passion for saying the same thing twice",
    });
  }
}

module.exports = db;
