const express=require('express');
const router=express.Router();
const fileupload=require('express-fileupload');
const cors=require('cors');
const connection=require('../db/publicdb');
const shortid=require('shortid');


router.use(fileupload());
router.use(cors());


router.post('/multiple/fileupload', function(request, response)
{
    console.log(request.files);
    var filesNameArray=[];
    const newpath="/home/sankha/Desktop/gravity/clifiles/";
    for(let i=0;i<request.files.attachments.length;i++)
    {
        const file=request.files.attachments[i];
        const filename=file.name;
        filesNameArray.push(filename);
        file.mv(`${newpath}${filename}`,(err)=>
        {
            if(err)
            {
                response.status(500).send({
                    code:500
                })
            }
            else
            {
                console.log('file uploaded');
            }
        })
    }
    const filesid=shortid.generate();
    var sql="insert into files(filesid, filesname) values(?,?)";
    connection.query(sql,[filesid, filesNameArray.toString()],function(err, result)
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
            console.log('successfully inserted');
            response.status(200).send({
                code:200,
                message:"File Uploaded",
                filesid
            })
        }
    })
    
})


router.post('/single/fileupload', function(request, response)
{
    const newpath="/home/sankha/Desktop/gravity/clifiles/";
    const file=request.files.file;
    const filename=file.name;
    file.mv(`${newpath}${filename}`,(err)=>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            const filesid=shortid.generate();
            var sql="insert into files(filesid, filesname) values(?,?)";
            connection.query(sql,[filesid, filename],function(err, result)
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
                    console.log('successfully inserted');
                    response.status(200).send({
                        code:200,
                        message:"File Uploaded",
                        filesid
                    })
                }
            })
        }
    })
})


router.post('/download/:id', function(request, response)
{
    const { id }=request.params;
    var sql="select filesname from files where filesid = ?";
    connection.query(sql,[id], function(err, result)
    {
        if(err)
        {
            console.log(err);
            response.status(500).send({ code:500 })
        }
        if(result.length>0)
        {
            const filesname=result[0].filesname;
            const files=filesname.split(',');
            var filesDownloadLink=[];
            for(let i=0;i<files.length;i++)
            {
                filesDownloadLink.push(`http://127.0.0.1:4000/${files[i]}`);
            }
            response.status(200).send({ filesDownloadLink })
        }
        else
        {
            response.status(400).send({ code:400 })
        }
    })
})


module.exports=router;