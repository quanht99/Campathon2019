const response = require("../helps/response");
const RoleQuery = require("../helps/query/role");

async function getRoles(req, res) {
    try{
        let role = await RoleQuery.getRoles();
        let data = {
            role
        };
        return res.json(response.success(data))
    }
    catch(err){
        console.log("getRoles: ", err.message);
        return res.json(response.fail(err.message))
    }
}

module.exports = {
    getRoles
};