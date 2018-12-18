const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Users = require('../mongodb/home-model/accessControl');

router.get('/users', (req, res, next)=>{
  Users.getUsers()
  .then(users=>{
    res.json({success:true, users: users});
  })
  .catch(err=>{
    res.json({success:false, msg: err.message});
  })
})

router.get('/users/:id/name', (req, res, next)=>{
  let userId = req.params.id;
  Users.getUserName(userId)
  .then(result=>{
    res.json({success:true, userName: result});
  })
  .catch(err=>{
    res.json({success:false, msg: err.message});
  })
})

router.get('/users/name', (req, res, next)=>{
  let faceId = req.query.faceId;
  Users.getUserFromFaceId(faceId)
  .then(user=>{
    res.json({success:true, userName: user.name});
  })
  .catch(err=>{
    res.json({success:false, msg: err.message});
  })
})

router.post('/users', (req, res, next)=>{
  let newUser = req.body;
  Users.addUser(newUser)
  .then(result=>{
    res.json({success:true, msg: 'user has been added'})
  })
  .catch(err=>{
    res.json({success:false, msg: err.message});
  })
})

router.delete('/users/:id', (req, res, next)=>{
  let userId = req.params.id;
  Users.deleteUser(userId)
  .then(result=>{
    res.json({success:true, msg: 'user has been deleted'})
  })
  .catch(err=>{
    res.json({success:false, msg: err.message});
  })
})

router.put('/users/:id/img-path', (req, res, next)=>{
  let userId = req.params.id;
  let imgPath = req.body.imgPath;
  Users.updateImgPath(userId, imgPath)
  .then(result=>{
    res.json({success:true, msg: 'imgPath has been updated'})
  })
  .catch(err=>{
    res.json({success:false, msg: err.message});
  })
})


module.exports = router;
