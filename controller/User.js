const UserQuery = require("../helps/query/user");
const RoleQuery = require("../helps/query/role");
const NotiQuery = require("../helps/query/notification");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const response = require("../helps/response");
const config = require('config');


async function register(req, res) {
    let {full_name, email, user_name, password} = req.body;
    try{
        if(!email || !full_name || !user_name || !password){
            throw new Error("Something missing.")
        }
        if(password.length < 8){
            throw new Error("Mật khẩu phải có ít nhất 8 kí tự.")
        }
        let user = await UserQuery.getUser({user_name: user_name, email: email});
        if(user){
            throw new Error("Tài khoản hoặc email đã tồn tại.")
        }
        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(password, salt);
        let payload = {
            user_name: user_name,
            email: email,
            full_name: full_name,
            password: hashPassword,
            role_id: 3,
            create_time: Date.now()
        };
        const newUsers = await UserQuery.createUser(payload);
        let data = {};
        res.json(response.success(data))
    }
    catch(err){
        console.log("register: ", err.message);
        return res.json(response.fail(err.message))
    }
}

async function login(req, res){
    try{
        let {user_name, password} = req.body;
        let user = await UserQuery.getUser({user_name: user_name, email: null});
        if(!user){
            throw new Error("Tài khoản không tồn tại.")
        }
        let checkPass = bcrypt.compareSync(password, user.dataValues.password);
        if(checkPass){
            const sixHours = 6 * 60 * 60 * 30 * 10;
            const token = jwt.sign({
                    id: user.dataValues.id,
                },
                config.get('ACCESS_SECRET_KEY'), {
                    expiresIn: sixHours
                }
            );
            let role = await RoleQuery.getPermissionFromRoleId(user.dataValues.role_id);
            let data = {
                token,
                user: {
                    id: user.dataValues.id,
                    user_name: user.dataValues.user_name,
                    full_name: user.dataValues.full_name,
                    email: user.dataValues.email,
                    role
                }
            };
            res.json(response.success(data))
        }else{
            throw new Error("Mật khẩu không chính xác.")
        }
    }
    catch(err){
        console.log("login: ", err.message);
        return res.json(response.fail(err.message))
    }
}

async function statisticUsers(req, res){
    let {sort_attribute, ascending, page_size, page_number} = req.query;
    try{
        if(parseInt(ascending) === 1){
            ascending = "ASC"
        }else{
            ascending = "DESC"
        }
        if(!sort_attribute){
            sort_attribute = "full_name"
        }
        let constrains = {
            ascending,
            sort_attribute,
            page_number,
            page_size
        };
        let users = await UserQuery.statisticUsers(constrains);
        return res.json(response.success(users))
    }
    catch(err){
        console.log("userStatistics: ", err.message);
        return res.json(response.fail(err.message))
    }
}

async function changeRoleUser(req, res){
    let {user_id} = req.params;
    let {role_id, reason} = req.body;
    try{
        await UserQuery.updateUser({role_id: role_id}, {id: user_id});
        await NotiQuery.createNotification({
            title: "Quyền truy cập của bạn đã bị thay đổi.",
            message: reason,
            user_id: user_id,
            is_read: "false",
            create_time: Date.now()
        });
        return res.json(response.success({}))
    }
    catch(err){
        console.log("changeRoleUser: ", err.message);
        return res.json(response.fail(err.message))
    }
}

async function getUser(req, res){
    let {user_id} = req.params;
    try{
        let user = await UserQuery.statisticUser({user_id: user_id});
        let data = {
            user
        };
        return res.json(response.success(data));
    }
    catch(err){
        console.log("getUser: ", err.message);
        return res.json(response.fail(err.message))
    }
}

module.exports = {
    register,
    login,
    statisticUsers,
    changeRoleUser,
    getUser
};