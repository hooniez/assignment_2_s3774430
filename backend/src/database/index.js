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
db.user.hasMany(db.post, {
  foreignKey: { name: "posted_by", allowNull: false },
});

// One post can have many pictures while each picture belongs to one post
db.post.hasMany(db.image, {
  foreignKey: { name: "id", allowNull: false},
})


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
  // Delete all the records in user and post
  await db.user.destroy({
    truncate: { cascade: true },
  });

  await db.post.destroy({
    truncate: { cascade: true },
  });

  let userExists = (await db.user.count()) > 0;

  if (!userExists) {
    const argon2 = require("argon2");

    let hash = await argon2.hash("abc123", { type: argon2.argon2id });
    await db.user.create({
      email: "mbolger@gmail.com",
      first_name: "Matthew",
      last_name: "Bolger",
      password_hash: hash,
      avatar_src: "null",
    });

    hash = await argon2.hash("def456", { type: argon2.argon2id });
    await db.user.create({
      email: "shekhar@gmail.com",
      first_name: "Shekhar",
      last_name: "Kalra",
      password_hash: hash,
      avatar_src: "null",
    });
  }

  let postExists = (await db.post.count()) > 0;

  if (!postExists) {
    await db.post.create({
      posted_by: "shekhar@gmail.com",
      parent_id: null,
      text: "Hello, my name is sk",
    });

    await db.post.create({
      posted_by: "shekhar@gmail.com",
      parent_id: null,
      text: "Hello again",
    });

    await db.post.create({
      posted_by: "mbolger@gmail.com",
      parent_id: 1,
      text: "Hello sk, i'm bolger",
    });
  }
}

module.exports = db;
