const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const bcrypt = require('bcryptjs');
const config = require('../../config/database');
const Schema = mongoose.Schema;

// QR Schema
const QRSchema = new Schema({
    name: String,
    email: String,
    content: String,
    userId: Schema.Types.ObjectId  
  });

  const QR = module.exports = mongoose.model('QR', QRSchema);

  module.exports.addQRcode = function(newUser, callback){
       newUser.save(callback);
      };

  module.exports.getListOfQRcodes = () => {
      return QR.find()
      };

  module.exports.deleteUser = (id) => {
    return QR.findByIdAndRemove(id)
        .then(()=>{
          return Promise.resolve('UsrQRcode has been deleted')
        })
      }

  
