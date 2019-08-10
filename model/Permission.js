module.exports = (sequelize, Sequelize) => {
    const Permission = sequelize.define('Permission', {
        name: {
            type: Sequelize.STRING
        }
    });

    Permission.associate = (models) => {
        Permission.hasMany(models.RolePermission, {
            foreignKey: "permission_id",
            sourceKey: "id"
        })
    };

    return Permission;
};