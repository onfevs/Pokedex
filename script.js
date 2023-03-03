// selecciona el contenedor en el que se mostrarán las tarjetas de Pokémon
const pokeContainer = document.querySelector('.pokemon-container');

// URL de la API de PokeAPI con un límite de 150 resultados
const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

// función asincrónica para obtener los datos de los pokemones de la API
async function getPokemonData(url) {
  try {
    // hace una solicitud de datos a la API utilizando la URL proporcionada
    const response = await fetch(url);
    // convierte la respuesta en formato JSON
    const data = await response.json();
    // extrae solo la información del resultado de los pokemones
    const pokemon = data.results;
    // crea un arreglo de promesas para cada pokemon en el resultado
    const pokemonPromises = pokemon.map(async (result) => {
      // llama a la función asincrónica para obtener los detalles de cada pokemon utilizando la URL de su API
      const pokemonData = await getPokemonDetails(result.url);
      return pokemonData;
    });
    // espera a que todas las promesas del arreglo se resuelvan antes de continuar
    const pokemonArray = await Promise.all(pokemonPromises);
    // devuelve un arreglo con los datos de cada pokemon
    return pokemonArray;
  } catch (error) {
    console.log(error);
  }
}

// función asincrónica para obtener los detalles de un pokemon de la API utilizando su URL de API
async function getPokemonDetails(url) {
  try {
    // hace una solicitud de datos a la API utilizando la URL proporcionada
    const response = await fetch(url);
    // convierte la respuesta en formato JSON
    const data = await response.json();
    // extrae solo la información necesaria para mostrar en la tarjeta de cada pokemon
    const pokemonDetails = {
      name: data.name,
      image: data.sprites.other.dream_world.front_default,
      number: data.id,
      abilities: data.abilities.map((ability) => {
        return {
          name: ability.ability.name,
          power: ability.slot,
        };
      }),
      moves: data.moves.map((move) => {
        return {
          name: move.move.name,
        };
      }),
      types: data.types.map((type) => {
        return {
          name: type.type.name,
        };
      }),
      stats: data.stats.map((stat) => {
        return {
          name: stat.stat.name,
          value: stat.base_stat,
        };
      }),
    };
    // devuelve un objeto con los detalles del pokemon
    return pokemonDetails;
  } catch (error) {
    console.log(error);
  }
}

// función para mostrar los datos de cada pokemon en forma de tarjeta en el DOM
function displayPokemon(pokemon) {
  // crea un arreglo de strings con el HTML de cada tarjeta de pokemon utilizando la información de cada pokemon en el arreglo proporcionado
  const pokemonHTMLString = pokemon
    .map(
      (pokemon) => `
        <div class="pokemon">
          <div class="pokemon-card">
            <div class="pokemon-card-front">
              <div class="pokemon-image">
                <img src="${pokemon.image}" alt="${pokemon.name}" data-id="${pokemon.number}" />
              </div>
              <div class="pokemon-name">
                <h3 class="pokemon-attribute">${pokemon.name}</h3>
                <div class="pokemon-number pokemon-attribute">#${pokemon.number.toString().padStart(3, '0')}</div>
              </div>
            </div>
            <div class="pokemon-card-back">
              <div class="pokemon-abilities">
                ${pokemon.abilities
          .map(
            (ability) => `
                      <div class="pokemon-ability">
                        <span class="pokemon-ability-name pokemon-attribute">${ability.name}</span>
                        <div class="pokemon-ability-bar" style="width:${ability.power * 25}%"></div>
                      </div>
                    `
          )
          .join('')}
              </div>
              <div class="pokemon-types">
                ${pokemon.types
          .map(
            (type) => `
                      <div class="pokemon-type pokemon-attribute">${type.name}</div>
                    `
          )
          .join('')}
              </div>
              <div class="pokemon-stats">
                ${pokemon.stats
          .map(
            (stat) => `
                      <div class="pokemon-stat">
                        <span class="pokemon-stat-name pokemon-attribute">${stat.name}</span>
                        <span class="pokemon-stat-value pokemon-attribute">${stat.value}</span>
                      </div>
                    `
          )
          .join('')}
              </div>
            </div>
          </div>
        </div>
        `
    )
    .join('');
  pokeContainer.innerHTML = pokemonHTMLString;

}

getPokemonData(apiUrl).then(displayPokemon);
