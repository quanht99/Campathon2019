let UserQuery = require("../helps/query/user");
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
            password: hashPassword
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
            let data = {
                token
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


module.exports = {
    register,
    login
};