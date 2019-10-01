module.exports = (sequelize, Sequelize) => {
    const RolePermission = sequelize.define('RolePermission', {

    });

    RolePermission.associate = (models) => {
        RolePermission.belongsTo(models.Role, {
            foreignKey: "role_id",
            targetKey: "id"
        });
        RolePermission.belongsTo(models.Permission, {
            foreignKey: "permission_id",
            targetKey: "id"
        })
    };

    return RolePermission;
};