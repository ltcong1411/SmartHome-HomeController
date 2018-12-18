const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.plugin(schema => { schema.options.usePushEach = true });
const Schema = mongoose.Schema;
const LightingControl = require('./lightingControl');
const Floor = require('./floor');
const socket = require('../../socket-io/socketio-client');
const moment = require('moment');

const OperationSchema = new Schema({
  _type: String,
  isRoot: Boolean,
  result: Boolean
}, {collection: 'operations',versionKey: false});

const LogicalOperationSchema = new Schema({
  _type: String,
  _1stOperand: {type: Schema.Types.ObjectId, ref: 'operations'},
  _2ndOperand: {type: Schema.Types.ObjectId, ref: 'operations'},
  operator: String,
  result: Boolean,
  isRoot: Boolean
}, {collection: 'operations',versionKey: false});

const RelationalOperationSchema = new Schema({
  _type: String,
  deviceId: Schema.Types.ObjectId,
  operator: String,
  value: Number,
  isUser: Boolean,
  userId: Schema.Types.ObjectId,
  result: Boolean,
  isRoot: Boolean
}, {collection: 'operations',versionKey: false});

const RuleSchema = new Schema({
    name: String,
    time: {
      from: String,
      to: String,
      isAllDay: Boolean
    },
    date: String,
    repeat: String,
    ifConditions: {type: Schema.Types.ObjectId, ref: 'operations'},
    thenActions: [{
      typeOfAction: String, //deviceAction, mobileAction
      typeOfMobileAction: String,  //call, message
      deviceId: Schema.Types.ObjectId,
      value: Number,
      phoneNumber: String,
      message: String
    }]
}, {versionKey: false});

const Rules = module.exports = mongoose.model('Rules', RuleSchema);
const Operations = module.exports.Operations = mongoose.model('operations', OperationSchema);
const RelationalOperations = module.exports.RelationalOperations = mongoose.model('RelationalOperation', RelationalOperationSchema);
const LogicalOperations = module.exports.LogicalOperations = mongoose.model('LogicalOperation', LogicalOperationSchema);


module.exports.getListOfRules = () => {
  return Rules.find()
  .populate({
    path: 'ifConditions',
    populate: {
      path: '_1stOperand _2ndOperand' ,
      populate: {
        path: '_1stOperand _2ndOperand'
      }
    }
  })
  .then(rules=>{
    if(!rules.length) throw new Error('No rule found');
    return Promise.resolve({success: true, rules: rules});
  })
}


//----------remove operation functions-----------//
function removeRelationalOperation(id) {
  return RelationalOperations.findByIdAndRemove(id)
}

function removeLogicalOperation(id) {
  return LogicalOperations.findById(id).then(operation=>{
    if(!operation){
      throw new Error('Logical operation not found')
    }
    let _1stOperand = operation._1stOperand;
    let _2ndOperand = operation._2ndOperand;
    return removeOperation(_1stOperand)
    .then(()=>{
      return removeOperation(_2ndOperand)
    })
    .then(operation.remove())
  })
}

 function removeOperation(operationId) {
    return Operations.findById(operationId).then(operation=>{
     if(!operation) return Promise.resolve({sucess: false, msg: 'Operation not found'});
     switch(operation._type){
       case 'RelationalOperation':
          console.log('remove relational operation: ' + operationId);
          return removeRelationalOperation(operation._id)
          break;
       case 'LogicalOperation':
          console.log('remove logical operation: ' + operationId);
          return removeLogicalOperation(operation._id)
          break;
       default:
          return operation.remove().then(()=>{
            return Promise.resolve({succes: true, msg: 'Operation has been removed: ' + operation._id})
          });
     }
   })
 }

////////////remove operation functions/////////////

// ----------create operation functions-----------//
function createRelationalOperation(operation) {
  let newOperation = new RelationalOperations(operation);
  newOperation.isRoot = false;
  return newOperation.save()
  .then((doc)=>{
    return Promise.resolve({success: true, operationId: doc._id, msg:'new relational operation has been saved'})
  })
}

function createLogicalOperation(operation){
  let newOperation = new LogicalOperations(operation);
  return createOperation(operation._1stOperand)
  .then((result)=>{
    newOperation._1stOperand = result.operationId;
    return createOperation(operation._2ndOperand)
  })
  .then((result)=>{
    newOperation._2ndOperand = result.operationId;
    newOperation.isRoot = false;
    return newOperation.save()
  })
  .then((doc)=>{
    return Promise.resolve({success:true, operationId: doc._id, msg: 'logicalOperations has been saved'})
  })

}

function createOperation(operation) {
  switch (operation._type) {
    case 'RelationalOperation':
      console.log('create relational operation')
      return createRelationalOperation(operation);
      break;
    case 'LogicalOperation':
      console.log('create logical operation')
      return createLogicalOperation(operation);
      break;
    default:
      console.log('Operation type invalid: ' + operation._type);
      throw new Error('Operation type invalid: ' + operation._type);
  }
}
//////////////////////////////////////////////////////////////

//-----------------------Update Rule-----------------------//
module.exports.updateRule = function (ruleId, newRule) {
  console.log();
  console.log('---------------UPDATE RULE-----------------')
  return Rules.findById(ruleId).then(rule=>{
    if(!rule) throw new Error('Rule not found');
    rule.time = newRule.time;
    rule.repeat = newRule.repeat;
    rule.thenActions = newRule.thenActions;
    let operationId = rule.ifConditions;
    return Operations.findById(operationId)
    .then((operation)=>{
      if(!operation) return Promise.resolve(true)
      return removeOperation(operation._id)
    })
    .then((result)=>{
      return createOperation(newRule.ifConditions)
    })
    .then((result)=>{
      rule.ifConditions = result.operationId
      return rule.save()
    })
    .then(rule=>{
      return Operations.findById(rule.ifConditions)
    })
    .then(operation=>{
      operation.isRoot = true;
      return operation.save()
    })
    .then(()=>{
      return Promise.resolve({success: true, msg: 'Rule has been updated'})
    })
  })
}

module.exports.deleteRule = function (ruleId, callback) {
  return Rules.findById(ruleId)
  .then(rule=>{
    if(!rule) throw new Error('Rule not found');
    return removeOperation(rule.ifConditions)
    .then(()=>{
      rule.remove();
      return Promise.resolve({success: true, msg:'Rule has been removed'});
    })
  })
}

module.exports.addNewRule = function (newRule, callback) {
  let ifCondition = new Operations({
    isRoot: true
  });
  return ifCondition.save()
  .then((doc)=>{
    let rule = new Rules({
      name: newRule.name,
      ifConditions: doc._id,
      time: {isAllDay: true},
      repeat: 'Daily'
    });
    rule.save();
    return Promise.resolve({success: true, msg:'new rule has been created'})
  })
}

const operators = {
  '==': (a, b) => {return a == b},
  '!=': (a, b) => {return a != b},
  '>' : (a, b) => {return a > b},
  '<' : (a, b) => {return a < b},
  '>=': (a, b) => {return a >= b},
  '<=': (a, b) => {return a <= b},
  'OR': (a, b) => {return a || b},
  'AND':(a, b) => {return a && b}
}

function performActions(actions) {
  console.log('actions')
  console.log(actions);
  for(let i=0; i<actions.length; i++){
    let action = actions[i];
    switch(action.typeOfAction){
      case 'deviceAction':
        LightingControl.getLightDetails(action.deviceId)
        .then(light=>{
          let msg = {_id: light._id, value: action.value}
          socket.emit('device-event', msg)
          if(light.typeOfLight==="Alarm")
            socket.emit('security-event', light)
          return Promise.resolve()
        })
        break;
      case 'mobileAction':
        socket.emit('mobile-action-event', action)
        break;
    }
  }
}

function isDateSatisfied(rule) {
  if(rule.repeat==='Daily') return Promise.resolve(rule)
  if(rule.repeat==='None') return Promise.reject('Date not satisfied')
  let repeatDates = rule.repeat.split(', ');
  let now = moment();
  let cnt = 0;
  for(let date of repeatDates){
    _date = moment(date, "ddd");
    if(_date.day()===now.day()) return Promise.resolve(rule)
    if(++cnt===repeatDates.length) return Promise.reject('Date not satisfied')
  }
}

function isTimeSatisfied(rule) {
  if(rule.time.isAllDay) return Promise.resolve(rule.thenActions);
  let fromTime = moment(rule.time.from, "HH:mm A");
  let toTime = moment(rule.time.to, "HH:mm A");
  if(toTime<fromTime){
    toTime = toTime.add(1, 'days');
  }
  let now = moment();
  if((fromTime < now)&&(now < toTime)) return Promise.resolve(rule.thenActions)
  return Promise.reject('Time not satisfied')
}

function operationSatisfied(operation) {
  let operationId = operation._id;
  if(operation.isRoot){
    return Rules.findOne({'ifConditions': operationId})
    .then(rule=>{
      return isDateSatisfied(rule)
    })
    .then(rule=>{
      return isTimeSatisfied(rule)
    })
    .then(actions=>{
      return performActions(actions)
    })
    .catch(err=>{
      console.log(err)
    })
  }
  return LogicalOperations
  .findOne({$or: [{'_2ndOperand': operationId}, {'_1stOperand': operationId}]})
  .populate('_1stOperand _2ndOperand')
  .then(operation=>{
    let _1stResult = operation._1stOperand.result;
    let _2ndResult = operation._2ndOperand.result;
    let operator = operation.operator;
    let result = operators[operator](_1stResult, _2ndResult);
    operation.result = result;
    return operation.save()
    .then(operation=>{
      if(operation.result){
        return operationSatisfied(operation);
      }
    })
  })
}

module.exports.checkOperations =  (target) => {
  return RelationalOperations.find({$or:[{deviceId: target._id},{userId: target._id}]})
  .then(operations=>{
    if(!operations.length) return Promise.resolve('Rules have been checked')
    let loop = (i) => {
      let operation = operations[i];
      let isUser = operation.isUser;
      if(!isUser){
        let operator = operation.operator;
        let result = operators[operator](target.value, operation.value)
        operation.result = result;
      } else {
        operation.result = true;
      }
      return operation.save()
      .then(operation=>{
        if(operation.result) return operationSatisfied(operation);
      })
      .then(()=>{
        if(++i===operations.length) return Promise.resolve('Rules have been checked')
        return loop(i)
      });
    };
    return loop(0);
  })
}
