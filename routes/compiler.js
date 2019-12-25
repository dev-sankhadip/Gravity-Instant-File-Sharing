const express=require('express');
const router=express.Router();
const checkCookies=require('../jwt/jwt').checkToken;
const fs=require('fs');
const { exec }=require('child_process');
const connection=require('../db/db');


router.post('/runcode',checkCookies, function(request, response)
{
    const { text, language, fileid }=request.body;
    if(language==='c')
    {
        const cFile='./code/test.c';
        const cOutFIle='./a.out';
        fs.writeFileSync(cFile,text);
        exec(`gcc ${cFile} && ${cOutFIle}`,(error, stdout, stderr)=>
        {
            if(error)
            {
                console.log(error);
            }
            if(stderr)
            {
                response.send({
                    error:stderr
                })
            }
            else if(stdout)
            {
                response.send({
                    stdout
                })
            }
        })
    }
    else if(language==='java')
    {
        console.log(text);
        fs.writeFileSync('Test.java', text);
        exec('javac Test.java | java Test',(error, stdout, stderr)=>
        {
            if(error)
            {
                console.log(error);
            }
            console.log("stdout=>", stdout);
            console.log("stderr=>", stderr);
        })
    }
})


module.exports=router;