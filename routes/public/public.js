const express=require('express');
const router=express.Router();
const checkCookies=require('../../jwt/jwt').checkToken;
const jwt=require('jsonwebtoken');
const config={
  secret:"iamthebest"
}


router.get('/multiple/image', function(request, response)
{
    const { expire, name }=request.query;
    const filesArray=name.split('=');
    jwt.verify(expire, config.secret, (err, decoded) => {
        if(err) 
        {
          response.json({
            success: false,
            code:'304',
            message: 'Token is not valid'
          });
        } 
        else 
        {
            var publicLinkOfImage=[];
            for(let i=0;i<filesArray.length-1;i++)
            {
                var url=`/public/${expire}/image/${filesArray[i]}`;
                publicLinkOfImage.push(url);
            }
            // console.log(publicLinkOfImage);
            response.render('multiplefiles/image.ejs',{ publicLinkOfImage });
        }
      });
})

router.get('/multiple/audio', function(request, response)
{
    const { expire, name }=request.query;
    const filesArray=name.split('=');
    jwt.verify(expire, config.secret, (err, decoded) => {
        if(err) 
        {
          response.json({
            success: false,
            code:'304',
            message: 'Token is not valid'
          });
        } 
        else 
        {
            var publicLinkOfImage=[];
            for(let i=0;i<filesArray.length-1;i++)
            {
                var url=`/public/${expire}/audio/${filesArray[i]}`;
                publicLinkOfImage.push(url);
            }
            response.render('multiplefiles/audio.ejs',{ publicLinkOfImage });
        }
      });
})

router.get('/multiple/video', function(request, response)
{
    const { expire, name }=request.query;
    const filesArray=name.split('=');
    jwt.verify(expire, config.secret, (err, decoded) => {
        if(err) 
        {
          response.json({
            success: false,
            code:'304',
            message: 'Token is not valid'
          });
        } 
        else 
        {
            var publicLinkOfImage=[];
            for(let i=0;i<filesArray.length-1;i++)
            {
                var url=`/public/${expire}/watchvideo/${filesArray[i]}`;
                publicLinkOfImage.push(url);
            }
            response.render('multiplefiles/video.ejs',{ publicLinkOfImage });
        }
      });
})


router.get('/multiple/docs', function(request, response)
{
    const { expire, name }=request.query;
    const filesArray=name.split('=');
    jwt.verify(expire, config.secret, (err, decoded) => {
        if(err) 
        {
          response.json({
            success: false,
            code:'304',
            message: 'Token is not valid'
          });
        }
        else 
        {
            var publicLinkOfImage=[];
            for(let i=0;i<filesArray.length-1;i++)
            {
                var url=`/public/${expire}/docs/${filesArray[i]}`;
                publicLinkOfImage.push(url);
            }
            response.render('multiplefiles/doc.ejs',{ publicLinkOfImage });
        }
      });
})


router.get('/add', function(request, response)
{

})

module.exports=router;