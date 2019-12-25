const express=require('express');
const router=express.Router();
const checkToken=require('../jwt/jwt').checkToken;
const connection=require('../db/db');
const fs=require('fs');

router.delete('/restore/:binid/:filetype',checkToken, function(request, response)
{
    const { email }=request.decoded;
    const { binid, filetype }=request.params;
    var deleteFromBinQuery="delete from bin where binid = ?";
    var restoreSqlQuery=`insert into ${filetype}(${filetype}id, userid, email, name, date) select fileid, userid, email, name, date from bin where binid = ?`;
    connection.query(restoreSqlQuery,[binid], function(err1, result)
    {
        if(err1)
        {
            console.log(err1);
            response.status(500).send({
                message:"Internal error"
            })
        }
        else
        {
            connection.query(deleteFromBinQuery,[binid], function(err, result1)
            {
                if(err)
                {
                    console.log(err);
                    response.status(500).send({
                        message:"Something Error"
                    })
                }
                else
                {
                    response.status(200).send({
                        code:200,
                        message:"Successfully Deleted"
                    })
                }
            })
        }
    })

})


router.delete('/delete/:binid',checkToken, function(request, response)
{
    const {email}=request.decoded;
    const { binid }=request.params;
    var getFileNameFromQuery="select * from bin where binid = ?";
    var deleteFromBinQuery="delete from bin where binid = ?";
    connection.query(getFileNameFromQuery,[binid], function(err, result)
    {
        if(err)
        {
            console.log(err);
            response.status(500).send({
                code:500,
                message:"Internal error"
            })
        }
        else
        {
            console.log(result);
            if(result[0].filetype==='image' || result[0].filetype==='audio')
            {
                fs.unlink(`../gravity/upload/${result[0].filetype}/${result[0].name}`, (err)=>
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    console.log('file deleted forever');
                })
            }
            else if(result[0].filetype==='doc')
            {
                fs.unlink(`../gravity/upload/docs/${result[0].name}`, (err)=>
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    console.log('Docs file deleted forever');
                })
            }
            else if(result[0].filetype==='video')
            {
                fs.unlink(`../gravity/videos/watchvideo/${result[0].name}`,(err)=>
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    console.log('Video File deleted forever')
                })
            }
            connection.query(deleteFromBinQuery,[binid], function(err, result1)
            {
                if(err)
                {
                    console.log(err);
                    response.status(500).send({
                        code:500,
                        message:"Internal error"
                    })
                }
                else
                {
                    response.send({
                        code:200,
                        message:"Deleted"
                    })
                }
            })
        }
    })
})

module.exports=router;