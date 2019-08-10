const RoleQuery = require("../helps/query/role");
const response = require("../helps/response");

function verifyPermission(permission){
    return async (req, res, next) => {
        let role = await RoleQuery.getPermissionFromRoleId(req.tokenData.role_id);
        let index = role.permission.indexOf(permission);
        if(index >= 0){
            next()
        }else{
            return res.json(response.fail("Tài khoản của bạn không có quyền thực hiện hành động này."))
        }
    }
}

module.exports = verifyPermission;