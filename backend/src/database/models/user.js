module.exports = (sequelize, DataTypes) =>
  sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(96),
      allowNull: false
    },
    date_joined: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    avatar_src: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
    
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
