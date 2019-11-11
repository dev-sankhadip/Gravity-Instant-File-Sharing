const express=require('express');
const router=express.Router();
const multer=require('multer');
const upload=multer({ dest:'upload/image/' });
const fs=require('fs');
const connection=require('../db/publicdb');
const shortid=require('shortid');
const { exec }=require('child_process');



router.get('/uploadpage', function(request, response)
{
    response.sendFile(__dirname+'/index.html');
})

router.post('/upload',upload.array('image'), function(request, response)
{
    var filesNameArray=[];
    const filesid=shortid.generate();
    fs.mkdir('../gravity/clifiles/'+filesid,{ recursive:true},(err)=>
    {
        if(err)
        {
            console.log(err)
        }
        for(let i=0;i<request.files.length;i++)
        {
            const oldpath=request.files[i].path;
            const newpath="/home/sankha/Desktop/gravity/clifiles/"+filesid+"/"+request.files[i].originalname;
            filesNameArray.push(request.files[i].originalname);
            fs.rename(oldpath, newpath, function(err)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log('uploaded');
                }
            })
        }
    })
    var sql="insert into files(filesid, filesname) values(?,?)";
    connection.query(sql,[filesid, filesNameArray.toString()], function(err, result)
    {
        if(err)
        {
            console.log(err);
            response.status(500).send({
                code:500
            })
        }
        else
        {
            response.send({
                code:200,
                filesid
            })
            console.log(result);
        }
    })
})

router.get('/download/:id', function(request, response)
{
    const { id }=request.params;
    var sql="select filesname from files where filesid = ?";
    connection.query(sql,[id], function(err, result)
    {
        if(err)
        {
            console.log(err)
        }
        if(result.length>0)
        {
            exec(`zip -r ../gravity/clifiles/files.zip ../gravity/clifiles/${id}`,(err, stdout, stderr)=>
            {
                if(err)
                {
                    console.log(err);
                    response.status(500).send({ code:"Internal error" });
                }
                response.download('../gravity/clifiles/files.zip', function(err)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    fs.unlink('../gravity/clifiles/files.zip',(err)=>
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                    })
                });
            })
        }
        else
        {
            response.send({ message:"Not found" })
        }
    })
})



module.exports=router;