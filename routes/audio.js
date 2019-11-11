const express=require('express');
const router=express.Router();
const multer=require('multer');
const fs=require('fs');
const jwt=require('jsonwebtoken');
const checkCookies=require('../jwt/jwt').checkToken;
const connection=require('../db/db');

const upload=multer({ dest:'upload/audio/' });
const config={
    secret:"iamthebest"
}


router.post('/upload', checkCookies ,upload.single('image'), function(request, response)
{
    const { imagename } = request.body;
    const { email }=request.decoded;
    const userid=request.cookies.id;
    console.log(email, userid);
    const oldpath=request.file.path;
    const fileExtension=request.file.originalname.split(".");
    const filename=imagename+"."+fileExtension[1];
    const newpath="/home/sankha/Desktop/gravity/upload/audio/"+filename;
    fs.rename(oldpath, newpath, function(err)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            var time=new Date().toLocaleDateString();
            var sqlInsertQuery="insert into audio(userid, email, name, date) values(?,?,?,?)";
            connection.query(sqlInsertQuery,[userid, email, filename, time],(err, result)=>
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
                        imageid:result.insertId
                    })
                }
            })
        }
    })
})

router.delete('/delete/:id',checkCookies, function(request, response)
{
    const audioid=request.params.id;
    const { email }=request.decoded;
    var sqlDeleteQuery="delete from audio where email = ? and audioid = ?";
    connection.query(sqlDeleteQuery,[email, audioid], function(err, result)
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

router.get('/download/:audioid',checkCookies, function(request, response)
{
    const audioid=request.params.audioid;
    const { email }=request.decoded;
    var sqlImageNameSelectQuery="select name from audio where audioid=? and email=?";
    connection.query(sqlImageNameSelectQuery,[audioid,email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            const filename=result[0].name;
            var file='../gravity/upload/audio/'+filename;
            response.download(file);
        }
    })
})

router.get('/generate/:id',checkCookies, function(request, response)
{
    const audioid=request.params.id;
    const { email }=request.decoded;
    var sql="select name from audio where audioid=? and email=?";
    connection.query(sql,[audioid, email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            var audioname=result[0].name;
            let token = jwt.sign({audioname: audioname},
                config.secret,
                {
                  expiresIn: '1h' //expires in 24 hours
                }
            )
            audioname=audioname.split(' ').join('%20');
            // const link=`http://127.0.0.1:4000/public/${token}/audio/`+audioname;
            const link=`http://127.0.0.1:4000/public/audio?expire=${token}&name=${audioname}`;
            response.send({
                link
            })
        }
    })
})


router.get('/getAllAudio',checkCookies, function(request, response)
{
    const { email }=request.decoded;
    console.log(email);
    var sqlSelectImageQuery="select name,audioid from audio where email = ?";
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
    console.log(linkGenerateIdArray);
    var sql=`select name from audio where audioid in (${linkGenerateIdArray})`;
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
            const link=`http://127.0.0.1:4000/public/multiple/audio?expire=${token}&name=${imagesname}`;
            response.send({
                link
            })
        }
    })
})



router.post('/check', checkCookies, function(request, response)
{
    const { filename }=request.body;
    var sql=`select name from audio where name like '${filename}%'`;
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