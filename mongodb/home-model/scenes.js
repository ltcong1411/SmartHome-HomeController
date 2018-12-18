const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const LightingControl = require('./lightingControl');
const Floor = require('./floor');

const SceneSchema = new Schema({
    name: String,
    date: String,
    time: String,
    repeat: String,
    devices: [{
      _id: Schema.Types.ObjectId,
      value: Number
    }]
}, {versionKey: false});

const Scenes = module.exports = mongoose.model('scenes', SceneSchema);


module.exports.getListOfScenes = function(){
  return Scenes.find()
  .then(scenes=>{
    if(!scenes.length) throw new Error('No scene found')
    return Promise.resolve(scenes)
  })
}

module.exports.findSceneById = function(id){
  return Scenes.findById(id)
  .then(scene=>{
    if(!scene) throw new Error('scene not found: ' + id)
    return Promise.resolve(scene)
  })
}

module.exports.addNewScene = function(newScene){
  let scene = new Scenes(newScene);
  scene.save()
  return Promise.resolve('Successfully added new scene')
}

module.exports.updateScene = function(id, newScene){
  return Scenes.findById(id)
  .then(scene=>{
    if(!scene) throw new Error('scene not found: ' + id)
    scene.time = newScene.time;
    scene.date = newScene.date;
    scene.devices = newScene.devices;
    scene.repeat = newScene.repeat;
    return scene.save();
  })
  .then(scene=>{
    cronJob.create(scene);
    Promise.resolve('scene has been updated')
  })
}

module.exports.deleteScene = function(id){
  return Scenes.findByIdAndRemove(id)
  .then(()=>{
    cronJob.stop(id);
    Promise.resolve('scene has been delete')
  })
}

const cronJob = require('../../cron-job/scenes');
