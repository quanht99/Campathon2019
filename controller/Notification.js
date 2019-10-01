const response = require("../helps/response");
const NotificationQuery = require("../helps/query/notification");

async function getNotifications(req, res) {
    try{
        let notifications = await NotificationQuery.getNotifications({user_id: req.tokenData.id});
        notifications = notifications.map(e => e.dataValues);
        let not_read = 0;
        for(let e of notifications){
            if(e.is_read == "false"){
                not_read = not_read + 1;
            }
        }
        let data = {
            notifications,
            not_read,
            count: notifications.length
        };
        return res.json(response.success(data))
    }
    catch(err){
        console.log("getNotifications: ", err.message);
        return res.json(response.fail(err.message))
    }
}

async function changeStatusNotification(req, res){
    try{
        let {is_read} = req.body;
        const {noti_id} = req.params;
        let noti = await NotificationQuery.updateNotification({is_read: is_read},{id: noti_id});
        noti = await NotificationQuery.getNotifications({user_id: req.tokenData.id, is_read: "false"})
        let data = {
            not_read: noti.length
        };
        return res.json(response.success(data))
    }
    catch(err){
        console.log("changeStatusNotification: ", err.message);
        return res.json(response.fail(err.message))
    }
}


module.exports = {
    getNotifications,
    changeStatusNotification
};