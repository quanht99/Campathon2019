const db = require("../../model/database");


module.exports.getPermissionFromRoleId = async (role_id) => {
    let role = await db.Role.findOne({
        where: {
            id: role_id
        },
        include: {
            model: db.RolePermission,
            include: {
                model: db.Permission
            }
        }
    });
    role = role.dataValues;
    role.permission = role.RolePermissions.map(e => {
        return e.dataValues.Permission.dataValues.name
    });
    delete role.RolePermissions;
    return role;
};

module.exports.getRoles = async () => {
    let roles = await db.Role.findAll({
        include: {
            model: db.RolePermission,
            include: {
                model: db.Permission
            }
        }
    });
    roles = roles.map(e => e.dataValues);
    for(let e of roles){
        e.permission = e.RolePermissions.map(ele => {
            return ele.dataValues.Permission.dataValues.name
        });
        delete e.RolePermissions;
    }
    return roles;
};
