module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        user_name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        full_name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.TEXT
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Post, {
            foreignKey: "user_id",
            sourceKey: "id"
        });
        User.hasMany(models.Comment, {
            foreignKey: "user_id",
            sourceKey: "id"
        })
    };

    return User;
};