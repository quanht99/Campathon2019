module.exports = (sequelize, Sequelize) => {
    const CommentImage = sequelize.define('CommentImage', {
        url: {
            type: Sequelize.STRING
        }
    });

    CommentImage.associate = (models) => {
        CommentImage.belongsTo(models.Comment, {
            foreignKey: "comment_id",
            targetKey: "id"
        })
    };

    return CommentImage;
};