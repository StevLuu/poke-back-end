const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokeSchema = new Schema({
    name: {type: String, unique: true, required: true},
    // type: {type: String, default: "Normal", required: true},
    sprite: {type: String, default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png", required: true},

    
}, {timestamps: true})

const Poke = mongoose.model('Poke', pokeSchema);

module.exports = Poke;