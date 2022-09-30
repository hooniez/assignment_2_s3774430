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

// One user can have many posts while each post belongs to one user
db.user.hasMany(db.post, {
  foreignKey: "postedBy",
});

db.post.belongsTo(db.user, {
  foreignKey: "postedBy",
});

db.user.belongsToMany(db.user, {
  as: "followed",
  through: db.follow,
});

// Create a junction table called Follow to keep track of who follows whom

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
      id: 1,
      postedBy: 1,
      parentId: null,
      text: "Hello, my name is Myeonghoon",
    });

    await db.post.create({
      postedBy: 1,
      parentId: null,
      text: "Hello again",
    });

    await db.post.create({
      postedBy: 2,
      parentId: 1,
      text: "Hello sk, my name is Hara",
    });

    await db.post.create({
      postedBy: 3,
      parentId: null,
      text: "Hello world, i'm Jihoon",
    });

    await db.post.create({
      id: 5,
      postedBy: 3,
      parentId: 1,
      text: "Hello, Myeonghoon. I'm Jihoon",
    });

    await db.post.create({
      id: 6,
      postedBy: 4,
      parentId: null,
      text: "Hello, my name is Hwangkyu",
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
}

module.exports = db;

// module.exports = (sequelize, DataTypes) =>
//   sequelize.define(
//     "follow",
//     {
//       followingId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         references: {
//           model: "users",
//           key: "id",
//         },
//       },
//       followedId: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         references: {
//           model: "users",
//           key: "id",
//         },
//       },
//     },
//     {
//       // Don't add the timestamp attributes (updatedAt, createdAt).
//       timestamps: false,
//     }
//   );
