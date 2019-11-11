const express=require('express');
const router=express.Router();
const fs=require('fs');
const conection=require('../db/db');
const jwt=require('jsonwebtoken');
const config={
    secret:'iamthebest'
}

router.post('/file', function(request, response)
{
    const { type, id, email }=request.body;
    console.log(type, id);
    var sql=`select name from ${type} where ${type}id = ? and email = ?`;
    conection.query(sql,[id, email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        if(result.length>0)
        {
            var filename=result[0].name;
            let token = jwt.sign({filename: filename},
                config.secret,
                {
                  expiresIn: '1h' //expires in 24 hours
                }
            )
            filename=filename.split(' ').join('%20');
            const link=`http://127.0.0.1:4000/public/${token}/${type}/`+filename;
            response.send({
                link,
                code:200
            })
        }
        else
        {
            response.send({
                code:400
            })
        }
    })
})


router.post('/doc', function(request, response)
{
    const { type,id, email }=request.body;
    var sql="select name from doc where docid = ? and email = ?";
    conection.query(sql,[id, email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        if(result.length>0)
        {
            var filename=result[0].name;
            let token = jwt.sign({filename: filename},
                config.secret,
                {
                  expiresIn: '1h' //expires in 24 hours
                }
            )
            filename=filename.split(' ').join('%20');
            const link=`http://127.0.0.1:4000/public/${token}/docs/`+filename;
            response.send({
                link,
                code:200
            })
        }
        else
        {
            response.send({
                code:400
            })
        }
    })
})

module.exports=router;