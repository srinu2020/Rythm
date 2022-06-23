const mysql=require("mysql")
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database:"rythm_db"
})
db.connect((err)=>{
    if(!err)
    console.log("connected with db");
    else
    console.log("not  connected with db");
})
module.exports=db;









    