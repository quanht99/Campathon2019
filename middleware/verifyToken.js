const jwt = require("jsonwebtoken");
const response = require('../helps/response');
const secret = require("config").get("ACCESS_SECRET_KEY");
const db = require("../model/database");

async function verifyAccessToken(req, res, next){
    const accessToken = req.headers["token"];
    if (accessToken) {
        jwt.verify(accessToken, secret, async function (err, decoded) {
            if (err){
                return res.json(response.fail("unauthorized"))
            }
            else req.tokenData = decoded;
            let user = await db.User.findOne({
                where: {
                    id: req.tokenData.id
                }
            });
            req.tokenData.role_id = user.dataValues.role_id;
            next();
        })
    }
    else {
        return res.json(response.fail("Missing token"))
    }
};

module.exports = verifyAccessToken;

