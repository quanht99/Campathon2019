const db = require("../../model/database");


module.exports.createComment = async (payload) => {
    return await db.Comment.create(payload)
};


module.exports.createImageInComment = async (payload) => {
    return await db.CommentImage.create(payload)
};

module.exports.getComments = async (constrains) => {
    let sql = "SELECT \n" +
        "    User.full_name AS comment_by,\n" +
        "    C.*,\n" +
        "    SUM(IF(VC.type = 'up_vote', 1, 0)) AS up_vote,\n" +
        "    SUM(IF(VC.type = 'down_vote', 1, 0)) AS down_vote,\n" +
        "    (SELECT \n" +
        "            GROUP_CONCAT(url)\n" +
        "        FROM\n" +
        "            CommentImage\n" +
        "        WHERE\n" +
        "            CommentImage.comment_id = C.id\n" +
        "        GROUP BY comment_id) AS attachments\n" +
        "FROM\n" +
        "    Comment AS C\n" +
        "        INNER JOIN\n" +
        "    User ON User.id = C.user_id\n" +
        "        LEFT JOIN\n" +
        "    VoteComment AS VC ON VC.comment_id = C.id\n" +
        "   where C.post_id = :post_id" +
        " GROUP BY C.id\n" +
        "ORDER BY create_time ASC";
    return await db.sequelize.query(sql, {
        replacements: constrains,
        type: db.sequelize.QueryTypes.SELECT
    });
};