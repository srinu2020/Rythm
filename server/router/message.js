const express=require('express');
const router=express.Router();
constdb=require('../db/conn');

//get all message of friend
router.get('/:friendId',(req, res)=>{
    const user=req.session.userId;
    var sql='(SELECT * FROM messages WHERE `from`=? AND `to`=?) union (SELECT * FROM messages WHERE `from`=? AND `to`=?) order by date';
   db.query(sql,[user,req.params.friendId, req.params.friendId,user],(err, rows, fields)=>{
        if(!err)
          res.send(rows);
        else
          console.log(err);  
    });
});
//insert message
router.post('/:friendId',(req, res)=>{
    const user=req.session.userId;
    var sql='INSERT INTO messages SET ?';
    const value={
        messageId:0,
        from: user,
        to: req.params.friendId,
        bodyText: req.body.bodyText,
        subject: req.body.subject,
        groupId:null,
        isDeleted:0,
        date:new Date()
    }
   db.query(sql,value,(err,result)=>{
        if(!err)
           res.send('inserted');
        else
           console.log(err);   
    })
});

//delete messages with friends
router.put('/:msgId',(req, res)=>{
    var sql='UPDATE messages SET isDeleted=1 WHERE messageId=?';
   db.query(sql,req.params.msgId,(err, result)=>{
        if(!err)
           res.send('message deleted');
        else
           console.log(err);
    })
});

//get all the group message
router.get('/groupMessage/:groupId',(req, res)=>{
    const user=req.session.userId;
    var sql='SELECT * FROM messages WHERE groupId=?';
   db.query(sql,[req.params.groupId],(err, rows, fields)=>{
        if(!err)
          res.send(rows);
        else
          console.log(err);  
    });
});

//Send message in a group
router.post('/groupMessage/:groupId',(req, res)=>{
    const user=req.session.userId;
    var sql='INSERT INTO messages SET ?';
    const value={
        messageId:0,
        from: user,
        to: null,
        bodyText: req.body.bodyText,
        subject: req.body.subject,
        groupId:req.params.groupId,
        isDeleted:0,
        date:new Date()
    }
   db.query(sql,value,(err,result)=>{
        if(!err)
           res.send('inserted');
        else
           console.log(err);   
    });
});


module.exports=router;