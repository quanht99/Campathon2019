module.exports = (sequelize, Sequelize) => {
    const PostImage = sequelize.define('PostImage', {
        url: {
            type: Sequelize.STRING
        }
    });

    PostImage.associate = (models) => {
        PostImage.belongsTo(models.Post, {
            foreignKey: "post_id",
            targetKey: "id"
        })
    };

    return PostImage;
};