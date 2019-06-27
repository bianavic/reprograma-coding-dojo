const {
  connect
} = require('./PokemonsApiRepository')
const TreinadoresModel = require('./TreinadoresSchema')
const {
  PokemonsModel
} = require('./PokemonsSchema')
const LIMITE_NIVEL_POKEMON = 150

connect()

const calcularNivel = (datas, nivelAnterior) => {
  const diff = Math.abs(new Date(datas.dataInicio) - new Date(datas.dataFim)) / 3600000
  const novoNivel = diff / 4 + nivelAnterior

  return novoNivel >= LIMITE_NIVEL_POKEMON ? LIMITE_NIVEL_POKEMON : novoNivel
}

const getAll = () => {
  return TreinadoresModel.find((error, treinadores) => {
    return treinadores
  })
}

const getById = (id) => {
  return TreinadoresModel.findById(id)
}

const add = (treinador) => {
  const novoTreinador = new TreinadoresModel(treinador)
  return novoTreinador.save()
}

const remove = (id) => {
  return TreinadoresModel.findByIdAndDelete(id)
}

const update = (id, treinador) => {
  return TreinadoresModel.findByIdAndUpdate(
    id, {
      $set: treinador
    }, {
      new: true
    }
  )
}

const addPokemon = async (treinadorId, pokemon) => {
  const treinador = await getById(treinadorId)
  const novoPokemon = new PokemonsModel(pokemon)

  treinador.pokemons.push(novoPokemon)
  return treinador.save()
}

const treinarPokemon = async (treinadorId, pokemonId, datas) => {
  const treinador = await getById(treinadorId)
  const pokemon = treinador.pokemons.find(pokemon => pokemon._id === pokemonId)

  if (pokemon.nivel >= LIMITE_NIVEL_POKEMON) {
    throw new Error('Seu pokémon já é forte o suficiente!')
  }

  pokemon.nivel = calcularNivel(datas, pokemon.nivel)
  return treinador.save()
}

const getPokemons = async treinadorId => {
  const treinador = await getById(treinadorId)
  return treinador.pokemons
}

const updatePokemon = (treinadorId, pokemonId, pokemon) => {
  return TreinadoresModel.findOneAndUpdate({
    _id: treinadorId,
    'pokemons._id': pokemonId
  }, {
    $set: {
      'pokemons.$': {
        ...pokemon,
        _id: pokemonId
      }
    }
  }, {
    new: true
  })
}

const getByPokemonId = async (treinadorId, pokemonId) => {
  const treinador = await getById(treinadorId)
  return treinador.pokemons.find(pokemon => {
    return pokemon._id === pokemonId
  })
}

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
  addPokemon,
  treinarPokemon,
  getPokemons,
  updatePokemon,
  getByPokemonId
}