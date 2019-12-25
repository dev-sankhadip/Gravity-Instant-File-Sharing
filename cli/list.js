const express=require('express');
const router=express.Router();
const connection=require('../db/db');


router.get('/:type',(request, response)=>
{
    const type=request.params.type;
    const { email, userid }=request.headers;
    var sql=`select * from ${type} where email = ? and userid = ?`;
    connection.query(sql,[email, userid], function(err, result)
    {
        if(err)
        {
            response.send({
                code:500,
                message:"Internal error"
            })
        }
        else
        {
            response.send({
                code:200,
                result
            })
        }
    })
})


module.exports=router;