module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        name: {
            type: Sequelize.STRING
        }
    });

    Role.associate = (models) => {
        Role.hasMany(models.RolePermission, {
            foreignKey: "role_id",
            sourceKey: "id"
        });
        Role.hasMany(models.User, {
            foreignKey: "role_id",
            sourceKey: "id"
        })
    };

    return Role;
};