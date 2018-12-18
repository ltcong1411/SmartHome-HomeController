const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const Schema = mongoose.Schema;

const AccessControlSchema = new Schema({
    name: String,
    imgPath: String,
    fingerprintId: [Number],
    rfid: [Number],
    faceId: [Number]
}, {versionKey: false});

const AccessControl = module.exports = mongoose.model('accessControl', AccessControlSchema);

module.exports.getUsers =  () => {
  return AccessControl.find()
  .then(users=>{
    if(!users.length) throw new Error('No user found');
    return Promise.resolve(users);
  })
}

module.exports.getUserFromFingerprint = (fingerprintId) => {
  return AccessControl.findOne({fingerprintId: fingerprintId})
}

module.exports.getUserFromFaceId = (faceId) => {
  return AccessControl.findOne({faceId: faceId})
}

module.exports.addUser = (newUser) => {
  let user = new AccessControl(newUser);
  return user.save();
}

module.exports.deleteUser =  (userId) => {
  return AccessControl.findByIdAndRemove(userId);
}

module.exports.getUserName = (userId) => {
  return AccessControl.findById(userId)
  .then(user=>{
    if(!user) throw new Error('User not found: ' + userId);
    return Promise.resolve(user.name)
  })
}

module.exports.updateImgPath = (userId, imgPath) => {
  return AccessControl.findById(userId)
  .then(user=>{
    if(!user) throw new Error('User not found: ' + userId);
    user.imgPath = imgPath;
    return user.save()
  })
}

module.exports.updateFingerprintId = (userId, fingerprintId) => {
  return AccessControl.findById(userId)
  .then(user=>{
    if(!user) throw new Error('User not found: ' + userId);
    user.fingerprintId.push(fingerprintId)
    return user.save()
  })
}

module.exports.updateFaceId = (userId, faceId) => {
  return AccessControl.findById(userId)
  .then(user=>{
    if(!user) throw new Error('User not found: ' + userId);
    user.faceId.push(faceId)
    return user.save()
  })
}

module.exports.deleteFingerprints = userId => {
  return AccessControl.findById(userId)
  .then(user=>{
    if(!user) throw new Error('User not found: ' + userId);
    user.fingerprintId = []
    return user.save()
  })
}

module.exports.getListOfFingerprints = userId => {
  return AccessControl.findById(userId)
  .then(user=>{
    if(!user) throw new Error('User not found: ' + userId);
    return Promise.resolve(user.fingerprintId)
  })
}
