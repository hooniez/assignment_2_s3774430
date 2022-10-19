module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "react",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      postId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "posts",
          key: "id",
        },
      },
      reaction: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dateReacted: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false,
    }
  );
