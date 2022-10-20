module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "follow",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      followedId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      dateFollowed: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false,
    }
  );
