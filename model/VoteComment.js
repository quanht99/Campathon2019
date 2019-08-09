module.exports = (sequelize, Sequelize) => {
    const VoteComment = sequelize.define('VoteComment', {
        type: {
            type: Sequelize.ENUM,
            values: ['up_vote', 'down_vote']
        }
    });

    VoteComment.associate = (models) => {
        VoteComment.belongsTo(models.Comment, {
            foreignKey: "comment_id",
            targetKey: "id"
        });
        VoteComment.belongsTo(models.User, {
            foreignKey: "user_id",
            targetKey: "id"
        })
    };

    return VoteComment;
};