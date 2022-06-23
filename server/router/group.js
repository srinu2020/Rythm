const express=require('express');
const router=express.Router();
const db=require('../db/conn');

//get all groups
router.get('/',(req, res)=>{
    db.query('SELECT * FROM `groups`',(err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    })
});

//insert new group
router.post('/', (req, res)=>{
    var sql='INSERT INTO `groups` SET ?';
    const value={
        groupsId: 0,
        name: req.body.name,
        artist: req.body.artist,
        description: req.body.description,
    }
    db.query(sql, value, (err, result)=>{
        if(!err)
          res.send('inserted');
        else
          console.log(err);  
    })
});

//delete group that has no member
router.put('/:groupId',(req,res)=>{
    var sql='DELETE FROM `groups` WHERE `groupsId`=? AND groupsId NOT IN(SELECT groupId FROM fav_groups)';
    db.query(sql,req.params.groupId,(err,result)=>{
        if(!err)
          res.send('delete operation done');
        else
          console.log(err); 
    })
})

//insert fav_group
router.post('/join/:groupId', (req, res)=>{
    var sql='INSERT INTO fav_groups SET ?';
    const user=req.session.userId;
    const value={
        fav_groupId: 0,
        userId:user,
        groupId:req.params.groupId
    }
    db.query(sql, value, (err, result)=>{
        if(!err)
          res.send('inserted');
        else
          console.log(err);  
    })
});

//get all your fav groups
router.get('/yourGroups', (req, res)=>{
    var sql='SELECT * FROM `groups` WHERE groupsId IN(SELECT groupId from fav_groups WHERE userId=?)';
    let user=req.session.userId;
    db.query(sql,user,(err, rows, fields)=>{
        if(!err)
           res.send(rows);
        else
           console.log(err);   
    })
});


//leave group
router.put('/yourGroups/:id',(req, res)=>{
    var sql='DELETE FROM fav_groups WHERE userId=? AND groupId=?';
    db.query(sql,[req.session.userId,req.params.id],(err,result)=>{
        if(!err)
           res.send("you left the group");
        else
           console.log(err); 
    })
});

//search group of an artist
router.get('/search/:name',(req,res)=>{
    var sql='SELECT * FROM `groups` WHERE artist=?';
    db.query(sql,req.params.name,(err,rows,fields)=>{
        if(!err)
           res.send(rows);
        else
           console.log(err);  
    })
})

module.exports=router;