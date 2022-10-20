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
db.login = require("./models/login.js")(db.sequelize, DataTypes);
db.visit = require("./models/visit.js")(db.sequelize, DataTypes);

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

// One user can have many logins while each login belongs to one user
db.user.hasMany(db.login, {
  foreignKey: "userId",
});
db.login.belongsTo(db.user, {
  foreignKey: "userId",
});

// Use the function table db.visit in a self-referential relationship
db.user.belongsToMany(db.user, {
  as: "visited",
  through: {
    model: db.visit,
    unique: false,
  },
});

// Learn more about associations here: https://sequelize.org/master/manual/assocs.html

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  // await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true });
};

module.exports = db;
