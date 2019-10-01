module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define('Notification', {
        title: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.STRING,
        },
        is_read: {
            type: Sequelize.STRING
        },
        create_time: {
            type: Sequelize.STRING
        }
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.User, {
            foreignKey: "user_id",
            targetKey: "id"
        });
    };

    return Notification;
};