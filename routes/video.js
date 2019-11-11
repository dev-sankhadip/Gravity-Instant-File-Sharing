const express=require('express');
const router=express.Router();
const multer=require('multer');
const fs=require('fs');
const jwt=require('jsonwebtoken');
const checkCookies=require('../jwt/jwt').checkToken;
const connection=require('../db/db');

const upload=multer({ dest:'upload/image/' });
const config={
    secret:"iamthebest"
}

router.post('/upload', checkCookies ,upload.single('image'), function(request, response)
{
    const { imagename } = request.body;
    const { email }=request.decoded;
    const userid=request.cookies.id;
    const oldpath=request.file.path;
    const fileExtension=request.file.originalname.split(".");
    const filename=imagename+"."+fileExtension[1];
    const newpath="/home/sankha/Desktop/gravity/videos/watchvideo/"+filename;
    fs.rename(oldpath, newpath, function(err)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            var time=new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString();
            var sqlInsertQuery="insert into video(userid, email, name, date) values(?,?,?,?)";
            connection.query(sqlInsertQuery,[userid, email, filename,time],(err, result)=>
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log(result.insertId);
                    response.send({
                        message:"Uploaded",
                        videoid:result.insertId
                    })
                }
            })
        }
    })
})

router.get('/watchvideo',checkCookies, function(request, response)
{
    const { email }=request.decoded;
    const videoname=request.query.v;
    const videoid=request.query.i;
    console.log(videoname);
    console.log(videoid);
    console.log(email);
    var isVideoExits="select * from video where email = ? and videoid = ?";
    connection.query(isVideoExits,[email, videoid], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        if(result.length>0)
        {
            response.render('player',{ videoname,result });
        }
        else
        {
            response.send({
                message:"Video does not exist"
            })
        }
    })
})


router.get('/download/:videoid',checkCookies, function(request, response)
{
    const videoid=request.params.videoid;
    const { email }=request.decoded;
    var sqlVideoNameSelectQuery="select name from video where videoid=? and email=?";
    connection.query(sqlVideoNameSelectQuery,[videoid,email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            const filename=result[0].name;
            var file='../gravity/videos/watchvideo/'+filename;
            response.download(file);
        }
    })
})


router.delete('/delete/:id',checkCookies, function(request, response)
{
    const videoid=request.params.id;
    const { email }=request.decoded;
    var sqlDeleteQuery="delete from video where email = ? and videoid = ?";
    connection.query(sqlDeleteQuery,[email, videoid], function(err, result)
    {
        if(err)
        {
            response.status(500).send({ code:500 })
        }
        else
        {
            response.status(200).send({ code:200 })
        }
    })
})

router.get('/generate/:id',checkCookies, function(request, response)
{
    const videoid=request.params.id;
    const { email }=request.decoded;
    var sql="select name from video where videoid=? and email=?";
    connection.query(sql,[videoid, email], function(err, result)
    {
        if(err)
        {
            console.log(err);
            response.status(400).send({
                message:"File does not exist"
            })
        }
        else
        {
            var videoname=result[0].name;
            let token = jwt.sign({videoname: videoname},
                config.secret,
                {
                  expiresIn: '1h'
                }
            )
            videoname=videoname.split(' ').join('%20');
            const link=`http://127.0.0.1:4000/public/video?expire=${token}&name=${videoname}`;
            response.send({
                link
            })
        }
    })
})

router.get('/getAllVideo',checkCookies, function(request, response)
{
    const { email }=request.decoded;
    console.log(email);
    var sqlSelectImageQuery="select name,videoid from video where email = ?";
    connection.query(sqlSelectImageQuery,[email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(result);
            response.send({
                result
            })
        }
    })
})

router.post('/generatemultiple', checkCookies, function(request, response)
{
    const { linkGenerateIdArray }=request.body;
    var sql=`select name from video where videoid in (${linkGenerateIdArray})`;
    connection.query(sql,function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        if(result.length>0)
        {
            var imagesname='';
            for(let i=0;i<result.length;i++)
            {
                imagesname+=result[i].name+'=';
            }
            let token = jwt.sign({imagesname: imagesname},
                config.secret,
                {
                  expiresIn: '1h'
                }
            )
            imagesname=imagesname.split(' ').join('%20');
            const link=`http://127.0.0.1:4000/public/multiple/video?expire=${token}&name=${imagesname}`;
            response.send({
                link
            })
        }
    })
})



router.post('/check', checkCookies, function(request, response)
{
    const { filename }=request.body;
    var sql=`select name from video where name like '${filename}%'`;
    connection.query(sql, function(err, res)
    {
        if(err)
        {
            console.log(err);
            response.status(500).send({
                message:"Internal Error"
            })
        }
        if(res.length>0)
        {
            response.send({
                code:12
            })
        }
        else
        {
            response.send({
                code:10
            })
        }
    })
})


module.exports=router;