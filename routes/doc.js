const express=require('express');
const router=express.Router();
const multer=require('multer');
const fs=require('fs');
const jwt=require('jsonwebtoken');
const checkCookies=require('../jwt/jwt').checkToken;
const connection=require('../db/db');

const upload=multer({ dest:'upload/docs/' });
const config={
    secret:"iamthebest"
}


router.post('/upload', checkCookies ,upload.single('doc'), function(request, response)
{
    function uploadFile()
    {
        const { imagename } = request.body;
        const { email }=request.decoded;
        const userid=request.cookies.id;
        const oldpath=request.file.path;
        const fileExtension=request.file.originalname.split(".");
        const filename=imagename+"."+fileExtension[1];
        const newpath="/home/sankha/Desktop/gravity/upload/docs/"+filename;
        fs.rename(oldpath, newpath, function(err)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                const time=new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString();
                var sqlInsertQuery="insert into doc(userid, email, name, date) values(?,?,?,?)";
                connection.query(sqlInsertQuery,[userid, email, filename, time],(err, result)=>
                {
                    if(err)
                    {
                        console.log(err);
                        response.status(500).send({
                            message:"Internal error"
                        })
                    }
                    else
                    {
                        response.send({
                            message:"Uploaded",
                            imageid:result.insertId
                        })
                    }
                })
            }
        })
    }

    var mimetypeArray=['application/pdf','text/x-csrc','text/plain'];
    if(mimetypeArray.includes(request.file.mimetype))
    {
        uploadFile();
    }
    else
    {
        uploadFile();
    }
})

router.get('/download/:docid',checkCookies, function(request, response)
{
    const docid=request.params.docid;
    const { email }=request.decoded;
    var sqlDocNameSelectQuery="select name from doc where docid=? and email=?";
    connection.query(sqlDocNameSelectQuery,[docid,email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            // console.log(result[0].name);
            const filename=result[0].name;
            var file='../gravity/upload/docs/'+filename;
            response.download(file);
        }
    })
})

router.delete('/delete/:id',checkCookies, function(request, response)
{
    const docid=request.params.id;
    const { email }=request.decoded;
    var sqlDeleteQuery="delete from doc where email = ? and docid = ?";
    connection.query(sqlDeleteQuery,[email, docid], function(err, result)
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
    const docid=request.params.id;
    const { email }=request.decoded;
    var sql="select name from doc where docid=? and email=?";
    connection.query(sql,[docid, email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            var docname=result[0].name;
            let token = jwt.sign({docname: docname},
                config.secret,
                {
                  expiresIn: '1h'
                }
            )
            docname=docname.replace('/ /g','%20');
            // const link=`http://127.0.0.1:4000/public/${token}/docs/`+docname;
            const link=`http://127.0.0.1:4000/public/docs?expire=${token}&name=${docname}`;
            response.send({
                link
            })
        }
    })
})

router.get('/edit/:fileid/:filename',checkCookies, function(request, response)
{
    const { email }=request.decoded;
    const { filename, fileid }=request.params;
    var sql="select name from doc where email = ? and docid = ?";
    connection.query(sql,[email, fileid], function(err, result)
    {
        if(err)
        {
            console.log(err);
            response.status(500).send({
                code:500,
                message:"internal error"
            })
        }
        else
        {
            function sendfile(fileName)
            {
                fs.readFile(`./upload/docs/${fileName}`,'utf-8',(err, data)=>
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        response.render('compiler',{ data,fileid });
                    }
                })
            }
            const filename=result[0].name;
            const extension=filename.split('.')[1];
            if(extension=="c")
            {
                sendfile(filename);
            }
            else if(extension=='txt')
            {
                fs.readFile(`./upload/docs/${filename}`,'utf-8',(err, data)=>
                {
                    if(err)
                    {
                        console.log(err);
                        return;
                    }
                    console.log(data);
                    response.render('doc_editor',{ data });
                })
            }
            else
            {
                response.sendFile('/home/sankha/Desktop/gravity/upload/docs/'+filename);
            }
        }
    })
})

router.post('/generatemultiple', checkCookies, function(request, response)
{
    const { linkGenerateIdArray }=request.body;
    var sql=`select name from doc where docid in (${linkGenerateIdArray})`;
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
            const link=`http://127.0.0.1:4000/public/multiple/docs?expire=${token}&name=${imagesname}`;
            response.send({
                link
            })
        }
    })
})

router.post('/check', checkCookies, function(request, response)
{
    const { filename }=request.body;
    var sql=`select name from doc where name like '${filename}%'`;
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