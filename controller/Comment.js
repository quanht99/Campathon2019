const response = require("../helps/response");
const CommentQuery = require("../helps/query/comment");
const uploadImageToS3 = require("../helps/s3/uploadImageToS3");
const createUrl = require("../helps/s3/createUrl");


async function getComments(req, res){
    let {post_id} = req.params;
    let {page_size, page_number} = req.query;
    if(!page_number){
        page_number = 0;
    }
    else{
        page_number = parseInt(page_number)
    }
    if(!page_size){
        page_size = 20;
    }
    else{
        page_size = parseInt(page_size)
    }
    try{
        let comments = await CommentQuery.getComments({post_id: post_id});
        let listComment = [];
        for(let i = page_number * page_size; i < page_size * (page_number + 1); i++){
            if(comments[i]){
                if(comments[i].attachments){
                    let arrayImage = comments[i].attachments.split(",");
                    comments[i].attachments = [];
                    for(let j=0; j<arrayImage.length; j++){
                        let url = await createUrl(arrayImage[j]);
                        comments[i].attachments.push(url)
                    }
                }
                listComment.push(comments[i])
            }
        }
        let data = {
            comments: listComment,
            count: comments.length
        };
        res.json(response.success(data))
    }catch(err){
        console.log("getComments: ", err.message);
        return res.json(response.fail(err.message))
    }
}

async function createComment(req, res){
    let {post_id} = req.params;
    let {content} = req.body;
    try{
        if(!content){
            throw new Error("Missing content");
        }
        let comment = await CommentQuery.createComment({
            content: content,
            post_id: post_id,
            user_id: req.tokenData.id,
            create_time: Date.now()
        });
        if(req.files.length > 0){
            for(let e of req.files){
                let type = e.originalname.split(".")[1];
                let url = await uploadImageToS3(e.buffer, type);
                await CommentQuery.createImageInComment({
                    url: url,
                    comment_id: comment.dataValues.id
                })
            }
        }
        res.json(response.success({}))
    }
    catch(err){
        console.log("getComments: ", err.message);
        return res.json(response.fail(err.message))
    }
}

async function voteComment(req, res){
    let {comment_id} = req.params;
    let {vote_type} = req.body;
    try{
        if(vote_type === "un_vote"){
            await CommentQuery.unVote({
                user_id: req.tokenData.id,
                comment_id: comment_id
            })
        }else{
            await CommentQuery.unVote({
                user_id: req.tokenData.id,
                comment_id: comment_id
            });
            await CommentQuery.Vote({
                user_id: req.tokenData.id,
                comment_id: comment_id,
                type: vote_type
            })
        }
        let vote_infor = await CommentQuery.getVoteInforOfComment(comment_id);
        vote_infor = vote_infor[0];
        delete vote_infor.id;
        let data = {
            vote_infor
        };
        return res.json(response.success(data))
    }
    catch(err){
        console.log("voteComment: ", err.message);
        return res.json(response.fail(err.message))
    }
}

async function checkVoteComment(req, res){
    let {comment_id} = req.query;
    try{
        if(!Array.isArray(comment_id)){
            comment_id = [comment_id]
        }
        let votes = await CommentQuery.checkVoteComment({
            user_id: req.tokenData.id,
            comment_id: comment_id
        });
        votes = votes.map(e => e.dataValues);
        let vote_status = comment_id.map(e => {
            let index = votes.findIndex(i => {
                return parseInt(i.comment_id) === parseInt(e)
            });
            if(index >= 0){
                return {
                    vote_type: votes[index].type,
                    comment_id: e
                }
            }else{
                return {
                    vote_type: "un_vote",
                    comment_id: e
                }
            }
        });
        let data = {
            vote_status
        };
        return res.json(response.success(data))
    }
    catch(err){
        console.log("checkVoteComment: ", err.message);
        return res.json(response.fail(err.message))
    }
}

module.exports = {
    getComments,
    createComment,
    voteComment,
    checkVoteComment
};