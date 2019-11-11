const express=require('express');
const router=express.Router();
const checkToken=require('../jwt/jwt').checkToken;
const connection=require('../db/db');


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
    var deleteFromBinQuery="delete from bin where binid = ?";
    connection.query(deleteFromBinQuery,[binid], function(err, result)
    {
        if(err)
        {
            console.log(err);
            response.status(400).send({
                code:400,
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
})

module.exports=router;