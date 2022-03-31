const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokeSchema = new Schema({
    productName: {type: String, unique: true},
    amount: {type: Number, default: 0, required: true},
    
}, {timestamps: true})

const Poke = mongoose.model('Poke', pokeSchema);

module.exports = Poke;