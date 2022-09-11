module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "post",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      posted_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.INTEGER,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date_posted: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false,
    }
  );
