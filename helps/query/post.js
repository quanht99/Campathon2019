const db = require("../../model/database");


module.exports.createPost = async (payload) => {
    return await db.Post.create(payload)
};

module.exports.createImageInPost = async (payload) => {
    return await db.PostImage.create(payload)
};

module.exports.getListPost = async (constrains) => {
    let sql = "SELECT \n" +
        "    User.full_name as post_by,\n" +
        "    P.*,\n" +
        "    SUM(IF(VP.type = 'up_vote', 1, 0)) AS up_vote,\n" +
        "    SUM(IF(VP.type = 'down_vote', 1, 0)) AS down_vote,\n";
        if(constrains.title){
            sql = sql + " MATCH (title) AGAINST (:title) as score, "
        }
        sql = sql + "    (SELECT \n" +
        "            url\n" +
        "        FROM\n" +
        "            PostImage\n" +
        "        WHERE\n" +
        "            PostImage.post_id = P.id\n" +
        "        LIMIT 1) AS preview_attachment\n" +
        "FROM\n" +
        "    Post AS P\n" +
        "        INNER JOIN\n" +
        "    User ON User.id = P.user_id\n" +
        "        LEFT JOIN\n" +
        "    VotePost AS VP ON VP.post_id = P.id \n" +
        "where id_deleted = \"false\" ";
        if(constrains.title){
            sql = sql + " and MATCH (title) AGAINST (:title) > 0\n "
        }
        sql =sql + "GROUP BY P.id\n" +
        `order by ${constrains.sort_attribute} ${constrains.ascending}`;
    return await db.sequelize.query(sql, {
        replacements: constrains,
        type: db.sequelize.QueryTypes.SELECT
    });
};

module.exports.getPost = async (post_id) => {
    let sql = "SELECT \n" +
        "    P.*,\n" +
        "    User.full_name AS post_by,\n" +
        "    SUM(IF(VP.type = 'up_vote', 1, 0)) AS up_vote,\n" +
        "    SUM(IF(VP.type = 'down_vote', 1, 0)) AS down_vote,\n" +
        "    (SELECT \n" +
        "            GROUP_CONCAT(url)\n" +
        "        FROM\n" +
        "            PostImage\n" +
        "        WHERE\n" +
        "            post_id = :post_id\n" +
        "        GROUP BY post_id) AS attachments\n" +
        "FROM\n" +
        "    Post AS P\n" +
        "        INNER JOIN\n" +
        "    User ON User.id = P.user_id\n" +
        "        LEFT JOIN\n" +
        "    VotePost AS VP ON VP.post_id = P.id\n" +
        "WHERE\n" +
        "    P.id = :post_id\n" +
        "GROUP BY P.id" ;
    return await db.sequelize.query(sql, {
        replacements: {
            post_id: post_id
        },
        type: db.sequelize.QueryTypes.SELECT
    });
};

module.exports.unVote = async (constrains) => {
    return db.VotePost.destroy({
        where: constrains
    })
};

module.exports.Vote = async (payload) => {
    return db.VotePost.create(payload)
};

module.exports.getVoteInforOfPost = async (post_id) => {
    let sql = "SELECT \n" +
        "    Post.id,\n" +
        "    SUM(IF(VP.type = 'up_vote', 1, 0)) AS up_vote,\n" +
        "    SUM(IF(VP.type = 'down_vote', 1, 0)) AS down_vote\n" +
        "FROM\n" +
        "    Post\n" +
        "        LEFT JOIN\n" +
        "    VotePost AS VP ON VP.post_id = Post.id\n" +
        "WHERE\n" +
        "    Post.id = :post_id\n " +
        "GROUP BY Post.id";
    return await db.sequelize.query(sql, {
        replacements: {
            post_id: post_id
        },
        type: db.sequelize.QueryTypes.SELECT
    });
};

module.exports.checkVotePost = async (constrains) => {
    return await db.VotePost.findOne({
        where: constrains
    })
};

module.exports.updatePost = async (payload, constrains) => {
    return await db.Post.update(payload, {
        where: constrains
    })
};