module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "image",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      img_src: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    }
  );