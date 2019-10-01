const db = require("../../model/database");


module.exports.getUser = async (constrains) => {
      return await db.User.findOne({
          where: {
              [db.Sequelize.Op.or]: [{user_name: constrains.user_name}, {email: constrains.email}]
          }
      })
};

module.exports.updateUser = async (payload, constrains) => {
    return await db.User.update(payload, {
        where: constrains
    })
};

module.exports.createUser = async (payload) => {
    return await db.User.create(payload)
};

module.exports.statisticUsers = async (constrains) => {
    let sql = "SELECT \n" +
        "    SUM(up_vote) AS up_vote,\n" +
        "    SUM(down_vote) AS down_vote,\n" +
        "    User.id,\n" +
        "    User.role_id,\n" +
        "    User.full_name,\n" +
        "    User.email\n," +
        "    User.create_time, " +
        "    Role.name as role_name " +
        "FROM\n" +
        "    (SELECT \n" +
        "        VP.user_id,\n" +
        "            SUM(IF(type = 'up_vote', 1, 0)) AS up_vote,\n" +
        "            SUM(IF(type = 'down_vote', 1, 0)) AS down_vote\n" +
        "    FROM\n" +
        "        VotePost AS VP\n" +
        "    GROUP BY user_id " +
        "    UNION ALL SELECT \n" +
        "        VC.user_id,\n" +
        "            SUM(IF(type = 'up_vote', 1, 0)) AS up_vote,\n" +
        "            SUM(IF(type = 'down_vote', 1, 0)) AS down_vote\n" +
        "    FROM\n" +
        "        VoteComment AS VC\n" +
        "    GROUP BY user_id) AS Vote\n" +
        "        right JOIN\n" +
        "    User ON User.id = Vote.user_id\n" +
        "        INNER JOIN\n" +
        "    Role ON Role.id = User.role_id\n" +
        "GROUP BY User.id\n " +
        `ORDER BY ${constrains.sort_attribute} ${constrains.ascending}`;
    let listUser = await db.sequelize.query(sql, {
        replacements: constrains,
        type: db.sequelize.QueryTypes.SELECT
    });
    let users = [];
    for(let i= constrains.page_size * constrains.page_number; i < (constrains.page_number + 1) * constrains.page_size; i++){
        if(listUser[i]){
            users.push(listUser[i])
        }
    }
    return {users, count: listUser.length};
};

module.exports.statisticUser = async (constrains) => {
    let sql = "SELECT \n" +
        "    SUM(up_vote) AS up_vote,\n" +
        "    SUM(down_vote) AS down_vote,\n" +
        "    User.id,\n" +
        "    User.role_id,\n" +
        "    User.full_name,\n" +
        "    User.email\n" +
        ",    User.create_time,     Role.name as role_name FROM\n" +
        "    (SELECT \n" +
        "        VP.user_id,\n" +
        "            SUM(IF(type = 'up_vote', 1, 0)) AS up_vote,\n" +
        "            SUM(IF(type = 'down_vote', 1, 0)) AS down_vote\n" +
        "    FROM\n" +
        "        VotePost AS VP\n" +
        "\twhere VP.user_id = :user_id\n" +
        "    GROUP BY user_id     \n" +
        "    UNION ALL SELECT \n" +
        "        VC.user_id,\n" +
        "            SUM(IF(type = 'up_vote', 1, 0)) AS up_vote,\n" +
        "            SUM(IF(type = 'down_vote', 1, 0)) AS down_vote\n" +
        "    FROM\n" +
        "        VoteComment AS VC\n" +
        "\twhere VC.user_id = :user_id\n" +
        "    GROUP BY user_id) AS Vote\n" +
        "        INNER JOIN\n" +
        "    User ON User.id = Vote.user_id\n" +
        "        INNER JOIN\n" +
        "    Role ON Role.id = User.role_id\n" +
        "GROUP BY user_id";
    let user = await db.sequelize.query(sql, {
        replacements: constrains,
        type: db.sequelize.QueryTypes.SELECT
    });
    user = user[0];
    return user;
};