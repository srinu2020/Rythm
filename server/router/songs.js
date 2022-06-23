const express=require('express');
const router=express.Router();
const db=require('../db/conn');

//get all songs
Router.get('/',(req, res)=>{
    db.query('SELECT * FROM songs',(err, rows, fields)=>{
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    })
});

//insert new song
Router.post('/',(req,res)=>{
    var sql='INSERT INTO songs SET ?';
    const value={
        idsongs: 0,
        artist: req.body.artist,
        title: req.body.title,
        album: req.body.album,
        year: req.body.year
    }
    db.query(sql, value,(err,result)=>{
        if(!err)
           res.send("inserted");
        else
           console.log(err);   
    })
});

 
//search song
Router.get('/searchSong/:title', (req, res)=>{
    var sql=`SELECT * from songs WHERE title LIKE '%${req.params.title}%'`;
    db.query(sql,(err, rows, fields)=>{
        if(!err)
           res.send(rows);
        else
           console.log(err);   
    })
});

//favourite songs
Router.post('/addFav/:songId',(req, res)=>{
    var sql='INSERT INTO fav_songs SET ?';
    const value={
        favSongId:0,
        userId: req.session.userId,
        songId: req.params.songId
    }
    db.query(sql,value,(err, rows, fields)=>{
        if(!err)
          res.send('inserted');
        else
          console.log(err);  
    });
});

//get all favourite songs
Router.get('/favourite', (req, res)=>{
    var sql='SELECT * FROM songs WHERE idsongs IN(SELECT songId from fav_songs WHERE userId=?)';
    let user=req.session.userId;
    db.query(sql,user,(err, rows, fields)=>{
        if(!err)
           res.send(rows);
        else
           console.log(err);   
    })
});

module.exports=Router;