module.exports = (sequelize, Sequelize) => {
    const VotePost = sequelize.define('VotePost', {
        type: {
            type: Sequelize.ENUM,
            values: ['up_vote', 'down_vote']
        }
    });

    VotePost.associate = (models) => {
        VotePost.belongsTo(models.Post, {
            foreignKey: "post_id",
            targetKey: "id"
        });
        VotePost.belongsTo(models.User, {
            foreignKey: "user_id",
            targetKey: "id"
        })
    };

    return VotePost;
};