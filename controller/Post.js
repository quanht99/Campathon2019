let PostQuery = require("../helps/query/post");
const response = require("../helps/response");
const uploadImageToS3 = require("../helps/s3/uploadImageToS3");
const createUrl = require("../helps/s3/createUrl");


async function createPost(req, res) {
    try{
        let {title} = req.body;
        if(req.files.length <= 0 ){
            throw new Error('Bạn chưa chọn ảnh nào.')
        }
        if(!title){
            throw new Error("Missing title.")
        }
        let post = await PostQuery.createPost({
            title: title,
            user_id: req.tokenData.id,
            create_time: Date.now(),
            is_confirm: "false",
            id_deleted: "false",
            views: 0
        });
        for(let e of req.files){
            let type = e.originalname.split(".")[1];
            let url = await uploadImageToS3(e.buffer, type);
            await PostQuery.createImageInPost({
                url: url,
                post_id: post.dataValues.id
            })
        }
        res.json(response.success({}))
    }
    catch(err){
        console.log("createPost: ", err.message);
        return res.json(response.fail(err.message))
    }
}

async function getListPost(req, res){
    let {title, sort_attribute, ascending, page_size, page_number} = req.query;
    let constrains = {};
    if(parseInt(ascending) === 1){
            constrains.ascending = "ASC"
    }else{
        constrains.ascending = "DESC"
    }
    constrains.sort_attribute = sort_attribute;
    if(!sort_attribute && title ){
        constrains.sort_attribute = "score"
    }
    constrains.title = title;
    if(!page_size){
        page_size = 20
    }else{
        page_size = parseInt(page_size)
    }
    if(!page_number){
        page_number = 0
    }else{
        page_number = parseInt(page_number)
    }
    try{
        let listPost = [];
        let posts = await PostQuery.getListPost(constrains);
        for(let i = page_size * page_number; i < page_size + (page_number + 1); i++){
            if(posts[i]){
                posts[i].preview_attachment = await createUrl(posts[i].preview_attachment);
                listPost.push(posts[i])
            }
        }
        let data = {
            count: posts.length,
            posts: listPost
        };
        return res.json(response.success(data))
    }
    catch(err){
        console.log("getListPost: ", err.message);
        return res.json(response.fail(err.message))
    }
}

async function getPost(req, res){
    let {post_id} = req.params;
    try{
        let post = await PostQuery.getPost(post_id);
        post = post[0];
        let arrImage = post.attachments.split(",");
        post.attachments = [];
        for(let i=0; i<arrImage.length; i++){
            let url = await createUrl(arrImage[i]);
            post.attachments.push(url)
        }
        let data = {
            post
        };
        return res.json(response.success(data))
    }
    catch(err){
        console.log("getPost: ", err.message);
        return res.json(response.fail(err.message))
    }
}

module.exports = {
    createPost,
    getListPost,
    getPost
};