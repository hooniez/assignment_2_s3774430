module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "image",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      imgSrc: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    }
  );