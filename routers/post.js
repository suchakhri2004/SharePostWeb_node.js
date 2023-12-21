const express = require('express');
const dayjs = require('dayjs');
const db = require('../db');
const { error } = require('console');
const { request } = require('http');
const router = express.Router();

async function getPostAndComments(postId) {
    let onePost = null;
    let postComments = [];
    try {
        // Get one post
        const somePosts = await db
        .select('*')
        .from('post')
        .where('id', +postId);
        onePost = somePosts[0];
        onePost.createdAtText = dayjs(onePost.createdAt).format('DD/MM/YYYY - HH:mm');

        // Get post comments
        postComments = await db
        .select('*')
        .from('comment')
        .where('postId', +postId);
        postComments = postComments.map(comment =>{
        const createdAtText = dayjs(comment.createdAt).format('DD/MM/YYYY - HH:mm');
        return {...comment,createdAtText};
    });
    } 
    catch (error) {
        console.error(error);
    }

    const customTitle = !!onePost ? `${onePost.title} | `: 'ไม่พบโพสต์' ;
    return { onePost,postComments, customTitle};
}


router.get('/new' , (request,response) =>{
    response.render('postnew');
});

router.post('/new' , async(request,response) =>{
    const { title, content, from, accepted  } = request.body ?? {};
    try {
        //validation
        if (!title || !content || !from){
            throw new Error('no text');
        }
        else if (accepted != 'on'){
            throw new Error('no accepted');
        }
        //Create post
        await db.insert({ title , content , from }).into('post');
    } 
    catch (error) {
        console.error(error);
        let errorMessage = 'ผิดพลาดอะไรสักอย่าง';
        if(error.message === 'no text') {
            errorMessage = 'กรุณาใส่ข้อมูลให้ครบ';
        }
        else if(error.message === 'no accepted'){
            errorMessage = 'กรุณาติ๊กถูกยอมรับ';
        }
       return response.render('postNew', {errorMessage, values:{ title,content,from}});
    }
    response.redirect('/p/new/done')
});

router.get('/new/done',(request,response)=>{
    response.render('postNewDone');
})

router.get('/:postId', async(request,response) =>{
    const { postId } = request.params;
    const postData = await getPostAndComments(postId);
    response.render('postId', postData);
});

router.post('/:postId/comment',async(request, response)=>{
    const { postId } = request.params;
    const { title, content, from, accepted  } = request.body ?? {};
    try {
        //validation
        if (!content || !from){
            throw new Error('no text');
        }
        else if (accepted != 'on'){
            throw new Error('no accepted');
        }
        //Create comment
        await db.insert({content , from, postId: +postId }).into('comment');
    } 
    catch (error) {
        console.error(error);
        let errorMessage = 'ผิดพลาดอะไรสักอย่าง';
        if(error.message === 'no text') {
            errorMessage = 'กรุณาใส่ข้อมูลให้ครบ';
        }
        else if(error.message === 'no accepted'){
            errorMessage = 'กรุณาติ๊กถูกยอมรับ';
        }

        const postData = await getPostAndComments(postId);
       return response.render('postId', {
        ...postData,errorMessage, values:{content,from}
    });
}
    response.redirect(`/p/${postId}`);
});

module.exports = router;