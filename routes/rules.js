const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const LightingControl = require('../mongodb/home-model/lightingControl');
const SensorModule = require('../mongodb/home-model/sensorModule');
const Rules = require('../mongodb/home-model/rules');



router.get('/', (req, res, next)=>{
  Rules.getListOfRules()
  .then(result=>{
    res.json(result)
  })
  .catch(err=>{
    res.json({success: false, msg: err.message});
    return next();
  })
})


router.put('/:id/', (req, res, next)=>{
  let ruleId = req.params.id;
  let newRule = req.body;
  Rules.updateRule(ruleId, newRule)
  .then(result=>{
    console.log(result);
    res.json(result)
  })
  .catch(err=>{
    console.log(err);
    res.json({success: false, msg: err.message});
    return next();
  })
})

router.delete('/:id', (req, res, next)=>{
  let ruleId = req.params.id;
  Rules.deleteRule(ruleId)
  .then(result=>{
    console.log(result);
    res.json(result)
  })
  .catch(err=>{
    console.log(err);
    res.json({success: false, msg: err.message});
    return next();
  })
})

router.post('/', (req, res, next)=>{
  let newRule = req.body;
  Rules.addNewRule(newRule)
  .then(result=>{
    console.log(result)
    res.json(result)
  })
  .catch(err=>{
    console.log(err);
    res.json({success: false, msg: err.message});
  })
})

module.exports = router;
