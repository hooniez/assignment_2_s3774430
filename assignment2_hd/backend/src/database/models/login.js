module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "login",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      dateLoggedIn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  );
