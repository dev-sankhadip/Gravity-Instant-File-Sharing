const mysql=require('mysql');
const chatDbConnection=mysql.createPool({
    host:"localhost",
    user:"root",
    password:"root",
    database:"chat"
})


module.exports=chatDbConnection;