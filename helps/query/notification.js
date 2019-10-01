const db = require("../../model/database");


module.exports.getNotifications = async (constrains) => {
    return await db.Notification.findAll({
        where: constrains
    })
};

module.exports.updateNotification = async (payload, constrains) => {
    return await db.Notification.update(payload, {
        where: constrains
    })
};

module.exports.createNotification = async (payload) => {
    return await db.Notification.create(payload);
};