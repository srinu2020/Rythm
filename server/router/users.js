const express=require('express')
const router=express.Router()
const db=require('../db/conn')

router.get('/hello',(req,res)=>{
    res.send(`hello deepu`)
})
router.post('/updateProfile',(req,res)=>{
    let user=req.body;
    var sql='UPDATE users SET ? WHERE email=?';
    var email=req.session.userId;

    db.query(sql, [user,email],(err,rows,fields)=>{
        if(!err)
           res.send("updated");
        else
           console.log(err);   
    })
});

router.post("/api/register",(req,res)=>{
 
    const {name,dob,addr,email,password}=req.body
    if(!name||!dob||!addr||!email||!password)
    {
        return res.status(422).json({error:"please fill the field property"})
    }
    else{
        const sqlfind="SELECT * FROM user_info WHERE email=?"
    db.query(sqlfind,[email],(err,result)=>{
         
        if(err)
        res.send(err);
        if(result.length){
            res.send({message:"user already exists"});
        }
        else{
             
            const sqlinsert="INSERT INTO user_info (userName,dob,addr,email,password) VALUES(?,?,?,?,?)"
    db.query(sqlinsert,[name,dob,addr,email,password],(err,result)=>{
         if(err)
           res.status(201).json({error:"Failed to register"})
         else
         res.status(200).json({message:"User registered successfully"})
    })
        }
    
        
    }) 
    }
     
    
    })
    
    router.post("/api/signin",async(req,res)=>{
        const{email,password}=req.body
        if(!email||!password)
        {res.status(400).json({err:"please fill the above details"})}
        try{
            const sqlemail="SELECT * FROM user_info WHERE email=?"
           db.query(sqlemail,[email],(err,result)=>{
              if(!result.length)
              {
                res.status(400).json({err:"enter a valid email"})
                  
              }
              else{
                 const sqlpassword="SELECT * FROM user_info WHERE email=? AND password=?"
                 db.query(sqlpassword,[email,password],(err,result)=>{
                   if(!result.length){
                    res.status(400).json({err:"enter a valid credential"})
                   }
                   else{
                    res.status(200).json({message:"User login successfully"})
                   }
                 })
              }
           })
        
                 
              
    
    
        }
        catch(err){
            console.log(err);
        }
        
    })
    router.get('/findUser/:id',(req,res)=>{
        let friend=req.params.id;
        var sql='Select name from users where email=?';
       db.query(sql,friend,(err, result)=>{
            if(err)
            {
                console.log(err);
                res.send({error: err});
            }
            else{
                if(result.length>0){
                    res.json({
                        user: "User exist"
                      });
                }else{
                    res.json({
                        message: "No such user exist"
                      });
                }
            }
    
        })
    });
    //delete friend from your list
router.put('/abc/friends/:emailId',(req, res)=>{
    let user=req.session.userId;
    var sql='Delete from friends WHERE userId=? AND friendId=?';
    db.query(sql,[user,req.params.emailId],(err,rows,fields)=>{
        if(!err){
            res.send('deleted given user');
        } 
        else
           console.log(err);   
    });
})
 

router.get('/abc/friends',(req, res)=>{
    let user=req.session.userId;
    var sql='SELECT name,email from users WHERE email IN(SELECT friendId FROM friends where userId=?)';
     db.query(sql, user, (err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else
          console.log(err);
    });
});

    router.post('/addFriend',(req, res)=>{
        let friend=req.body.friendId;
        let userId=req.session.userId;
        var sql='INSERT INTO friends VALUES ?';
        const info=[{idfriend:0,userId, friendId: friend},
                  {idfriend:0,userId: friend, friendId: userId}
                ];
       db.query(sql, [info.map(item=>[item.idfriend, item.userId, item.friendId])],(err,rows,fields)=>{
            if(!err)
               res.send("inserted");
            else
               console.log(err);   
        })
    });
    
    module.exports=router    