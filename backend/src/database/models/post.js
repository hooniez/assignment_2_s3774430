module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "post",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      postedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      parentId: {
        type: DataTypes.INTEGER,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      datePosted: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      imgSrc: {
        type: DataTypes.STRING,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false,
    }
  );
