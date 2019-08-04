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

    };

    return User;
};