module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define('Post', {
        title: {
            type: Sequelize.STRING
        },
        id_deleted: {
            type: Sequelize.ENUM,
            values: ["true", "false"],
            defaults: "false"
        },
        create_time: {
            type: Sequelize.STRING
        },
        views: {
            type: Sequelize.INTEGER
        },
        is_confirm: {
            type: Sequelize.ENUM,
            values: ["true", "false"],
            defaults: "false"
        }
    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, {
            foreignKey: "user_id",
            targetKey: "id"
        });
        Post.hasMany(models.Comment, {
            foreignKey: "post_id",
            sourceKey: "id"
        })
    };

    return Post;
};