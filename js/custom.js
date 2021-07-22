const keyWords = document.getElementById("keyWords");
const loadButton = document.getElementById("load-button");
const designDiv = document.getElementById("design-div");

async function loadMovies() {
  try {
    const response = await fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(keyWords.value)}&apikey=ce0e87a6`);
    //console.log(response);
    if (response.ok) {
      const responseJson = await response.json();
      //const posts = JSON.stringify(responseJson);
      //console.log(`posts: ${posts}`);
      return responseJson;
    } else {
      console.log("Not successful");
      return null;
    }
  } catch (error) {
    log(`Error: ${error}`);
  }
}

loadButton.addEventListener("click", () => {
  let delay = setTimeout(() => {
    log(`Loading movies... for key words : ${keyWords.value}`);
  }, 600);
  loadMovies().then(function(res) {
    designDiv.innerHTML = "";
    clearTimeout(delay);
    if (res !== null && res !== undefined) {
      //console.log(`res: ${JSON.stringify(res)}`);
      const results = res.Search;
      const totalResults = results.length;
      //console.log(`Fetched results: ${JSON.stringify(results)}`);
      delay = setTimeout(() => {
	log(`${totalResults} Movie${totalResults > 1 ? "s have to " : " has to "} be loaded.`);
      }, 600);
      clearTimeout(delay);
      results.map((result) => searchMovie(designDiv, result.Poster, result.Title, result.Year, result.imdbID, result.Type));
      log(`${totalResults} Movie${totalResults > 1 ? "s have " : " has "} been loaded.`);
    }
  });
});

function log(message) {
  document.getElementById("message").innerText = message;
}

function searchMovie(selector, URL, title, year, imdbID, imdbType) {
  if (imdbID !== null && imdbID !== undefined) {
    let delay = setTimeout(() => {
      log(`Loading movie... for Id : ${imdbID}`);
    }, 600);
    loadMovie(imdbID).then(function(res) {
      clearTimeout(delay);
      if (res !== null && res !== undefined) {
        //console.log(`res: ${JSON.stringify(res)}`);
        showMovie(designDiv, res.Poster, res.Title, res.Released, res.Plot, res.imdbID, res.Type);
      }
    });
  }
}

async function loadMovie(imdbID) {
  if (imdbID !== null && imdbID !== undefined) {
    try {
      const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=ce0e87a6`);
      //console.log(response);
      if (response.ok) {
        const responseJson = await response.json();
        //const post = JSON.stringify(responseJson);
        //console.log(`post: ${post}`);
        return responseJson;
      } else {
        console.log("Not successful");
      }
    } catch (error) {
      log(`Error: ${error}`);
    }
  }
}

const showMovie = (selector, URL, title, released, plot, imdbID, imdbType) => {
  selector.innerHTML += `
    <div class="colonnes-3">
      <div class="carte">
        <h4>${title}</h4>
        <p>${released}</p>
        <p>${plot}</p>
        <img class="image-carte" src='${URL}' alt='${title}'/>
      </div>
    </div>
  `;
}
