module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('Comment', {
        content: {
            type: Sequelize.STRING
        },
        create_time: {
            type: Sequelize.STRING
        }
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.Post, {
            foreignKey: "post_id",
            targetKey: "id"
        });
        Comment.belongsTo(models.User, {
            foreignKey: "user_id",
            targetKey: "id"
        });
        Comment.hasMany(models.CommentImage, {
            foreignKey: "comment_id",
            targetKey: "id"
        })
    };

    return Comment;
};