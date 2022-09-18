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
db.image = require("./models/image.js")(db.sequelize, DataTypes);

// One user can have many posts while each post belongs to one user

db.post.belongsTo(db.user, {
  foreignKey: {
    name: "postedBy",
    allowNull: false,
  },
});

// One post can have many pictures while each picture belongs to one post
db.post.hasMany(db.image, {
  foreignKey: { name: "id", allowNull: false },
});

// Learn more about associations here: https://sequelize.org/master/manual/assocs.html

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  
  // await db.sequelize.sync({ force: true });

  await seedData();
};

async function seedData() {
  let userExists = (await db.user.count()) > 0;

  if (!userExists) {
    const argon2 = require("argon2");

    let hash = await argon2.hash("abc123", { type: argon2.argon2id });
    await db.user.create({
      email: "mbolger@gmail.com",
      firstName: "Matthew",
      lastName: "Bolger",
      passwordHash: hash,
      avatarSrc: "null",
      secretKey: "null",
    });

    hash = await argon2.hash("def456", { type: argon2.argon2id });
    await db.user.create({
      email: "shekhar@gmail.com",
      firstName: "Shekhar",
      lastName: "Kalra",
      passwordHash: hash,
      avatarSrc: "null",
      secretKey: "null",
    });

    hash = await argon2.hash("def456", { type: argon2.argon2id });
    await db.user.create({
      email: "twiley@gmail.com",
      firstName: "Timothy",
      lastName: "Wiley",
      passwordHash: hash,
      avatarSrc: "null",
      secretKey: "null",
    });
  }

  let postExists = (await db.post.count()) > 0;

  if (!postExists) {
    await db.post.create({
      id: 1,
      postedBy: "shekhar@gmail.com",
      parentId: null,
      text: "Hello, my name is sk",
    });

    await db.post.create({
      id: 2,
      postedBy: "shekhar@gmail.com",
      parentId: null,
      text: "Hello again",
    });

    await db.post.create({
      id: 3,
      postedBy: "mbolger@gmail.com",
      parentId: 1,
      text: "Hello sk, i'm bolger",
    });

    await db.post.create({
      id: 4,
      postedBy: "twiley@gmail.com",
      parentId: null,
      text: "Hello world, i'm the T",
    });

    await db.post.create({
      id: 5,
      postedBy: "mbolger@gmail.com",
      parentId: 1,
      text: "Hello sk, i'm bolger, but with a passion for saying the same thing twice",
    });
  }
}

module.exports = db;
