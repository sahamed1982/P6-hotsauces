const mongoose  = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: { type:String, required: true, unique: true}, 
    // MEME SI UNIQUE : TRUE  fonctionne il peut y avoir des erreurs
    // donc  npm install --save mongoose-unique-validator
    password: { type: String, required: true}
})

userSchema.plugin(uniqueValidator);  //on applique le validator au schema

module.exports = mongoose.model('User', userSchema);