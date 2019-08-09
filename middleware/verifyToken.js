const jwt = require("jsonwebtoken");
const response = require('../helps/response');
const secret = require("config").get("ACCESS_SECRET_KEY");

async function verifyAccessToken(req, res, next){
    console.log("run");
    const accessToken = req.headers["token"];
    if (accessToken) {
        jwt.verify(accessToken, secret, function (err, decoded) {
            if (err){
                return res.json(response.fail("unauthorized"))
            }
            else req.tokenData = decoded;
            next();
        })
    }
    else {
        return res.json(response.fail("Missing token"))
    }
};

module.exports = verifyAccessToken;

