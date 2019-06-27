const mongoose = require('mongoose')
const {
  PokemonsSchema
} = require('./PokemonsSchema')
const Schema = mongoose.Schema
const TreinadoresSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  nome: {
    type: String,
    required: true
  },
  foto: {
    type: String,
    required: true
  },
  pokemons: [PokemonsSchema]
})

const TreinadoresModel = mongoose.model('treinadores', TreinadoresSchema)

module.exports = TreinadoresModel