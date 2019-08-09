const db = require("../../model/database");


module.exports.getUser = async (constrains) => {
      return await db.User.findOne({
          where: {
              [db.Sequelize.Op.or]: [{user_name: constrains.user_name}, {email: constrains.email}]
          }
      })
};

module.exports.createUser = async (payload) => {
    return await db.User.create(payload)
};