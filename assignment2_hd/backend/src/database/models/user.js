module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING(96),
        allowNull: false,
      },
      dateJoined: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      avatarSrc: {
        type: DataTypes.STRING,
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      secretKey: {
        type: DataTypes.STRING,
      },
    },
    {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false,
    }
  );
