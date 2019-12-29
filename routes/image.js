const express=require('express');
const router=express.Router();
const multer=require('multer');
const fs=require('fs');
const jwt=require('jsonwebtoken');
const fileUpload=require('express-fileupload');
const fse=require('fs-extra');


const checkCookies=require('../jwt/jwt').checkToken;
const connection=require('../db/db');

const upload=multer({ dest:'upload/image/' });
const config={
    secret:"iamthebest"
}

// router.use(fileUpload())

router.post('/upload', checkCookies ,upload.single('image'), function(request, response)
{
    const { imagename } = request.body;
    const { email }=request.decoded;
    const userid=request.cookies.id;
    const oldpath=request.file.path;
    const fileExtension=request.file.originalname.split(".");
    const filename=imagename+"."+fileExtension[1];
    const newpath="/home/sankha/Desktop/gravity/upload/image/"+filename;
    fs.rename(oldpath, newpath, function(err)
    {
        console.log(oldpath);
        if(err)
        {
            console.log(err);
        }
        else
        {
            const time=new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString();
            var sqlInsertQuery="insert into image(userid, email, name,type, date) values(?,?,?,?,?)";
            connection.query(sqlInsertQuery,[userid, email, filename,'file', time],(err, result)=>
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

router.post('/upload/folder', checkCookies, fileUpload(), function(request, response)
{
    const { email }=request.decoded;
    const userid=request.cookies.id;
    // console.log(request.body);
    const { file }=request.files;
    const { path }=request.body;
    const newpath="/home/sankha/Desktop/gravity/upload/image/";
    for(let i=0;i<file.length;i++)
    {
        // console.log(file[i]);
        let filePath=path[i].split('/');
        filePath.pop();
        fse.ensureDir(newpath+filePath.join('/'))
        .then((res)=>{
            file[i].mv(`${newpath}${path[i]}`,(err)=>{
                if(err)
                {
                    throw new Error("Error");
                }
                console.log('success');
            })
        }).catch((err)=>{
            console.log(err);
        })
    }
})


router.delete('/delete/:id',checkCookies, function(request, response)
{
    const imageid=request.params.id;
    const { email }=request.decoded;
    var sqlDeleteQuery="delete from image where email = ? and imageid = ?";
    connection.query(sqlDeleteQuery,[email, imageid], function(err, result)
    {
        if(err)
        {
            response.status(500).send({ code:500 })
        }
        else
        {
            console.log(result);
            response.status(200).send({ code:200 })
        }
    })
})

router.get('/download/:imageid',checkCookies, function(request, response)
{
    const imageid=request.params.imageid;
    const { email }=request.decoded;
    var sqlImageNameSelectQuery="select name from image where imageid=? and email=?";
    connection.query(sqlImageNameSelectQuery,[imageid,email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            // console.log(result[0].name);
            const filename=result[0].name;
            var file='../gravity/upload/image/'+filename;
            response.download(file);
        }
    })
})

router.get('/getAllImage',checkCookies, function(request, response)
{
    const { email }=request.decoded;
    console.log(email);
    var sqlSelectImageQuery="select name,imageid from image where email = ?";
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

router.get('/generate/:id',checkCookies, function(request, response)
{
    const imageid=request.params.id;
    const { email }=request.decoded;
    var sql="select name from image where imageid=? and email=?";
    connection.query(sql,[imageid, email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            var imagename=result[0].name;
            let token = jwt.sign({imagename: imagename},
                config.secret,
                {
                  expiresIn: '1h' //expires in 24 hours
                }
            )
            imagename=imagename.split(' ').join('%20');
            // const link=`http://127.0.0.1:4000/public/${token}/image/`+imagename;
            const link=`http://127.0.0.1:4000/public/image?expire=${token}&name=${imagename}`;
            response.send({
                link
            })
        }
    })
})

router.post('/generatemultiple', checkCookies, function(request, response)
{
    const { linkGenerateIdArray }=request.body;
    var sql=`select name from image where imageid in (${linkGenerateIdArray})`;
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
            const link=`http://127.0.0.1:4000/public/multiple/image?expire=${token}&name=${imagesname}`;
            response.send({
                link
            })
        }
    })
})



router.post('/check', checkCookies, function(request, response)
{
    const { filename }=request.body;
    var sql=`select name from image where name like '${filename}%'`;
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