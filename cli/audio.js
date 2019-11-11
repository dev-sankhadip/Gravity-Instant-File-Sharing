const express=require('express');
const router=express.Router();
const fileupload=require('express-fileupload');
const cors=require('cors');
const conection=require('../db/db');

router.use(fileupload());
router.use(cors());


router.post('/fileupload', function(request, response)
{
    const { email, id}=request.headers;
    const newpath="/home/sankha/Desktop/gravity/upload/audio/";
    const file=request.files.file;
    const filename=file.name;
    file.mv(`${newpath}${filename}`,(err)=>
    {
        if(err)
        {
            console.log(err);
        }
        const time=new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString();
        var sqlInsertQuery="insert into audio(userid, email, name, date) values(?,?,?,?)";
        conection.query(sqlInsertQuery,[id, email, filename, time], function(err, result)
        {
            if(err)
            {
                console.log(err);
                response.send({
                    code:'500',
                    message:'Internal error'
                })
            }
            else
            {
                response.send({
                    code:'200',
                    message:'Successfully uploaded'
                })
            }
        })
    })
})


module.exports=router;