const express=require('express');
const router=express.Router();
const connection=require('../db/db');
const jwt=require('jsonwebtoken');
const config={
    secret:"iamthebest"
}

router.get('/generate/:filetype/:fileId', function(request, response)
{
    var { filetype, fileId}=request.params;
    const { email, id }=request.headers;
    if(filetype=='docs')
    {
        filetype='doc';
    }
    var sql=`select name from ${filetype} where ${filetype}id = ? and email = ?`;
    connection.query(sql,[fileId, email], function(err, result)
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
            if(filetype=='doc')
            {
                filetype='docs';
            }
            // const link=`http://127.0.0.1:4000/public/${token}/${filetype}/`+filename;
            const link=`http://127.0.0.1:4000/public/${filetype}?expire=${token}&name=${filename}`;
            response.send({
                link,
                code:200
            })
        }
        else
        {
            response.send({
                message:"File does not exist, Check Again",
                code:400
            })
        }
    })
})


module.exports=router;