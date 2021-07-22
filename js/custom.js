const keyWords = document.getElementById("keyWords");
const loadButton = document.getElementById("load-button");
const designDiv = document.getElementById("design-div");

async function fetchWithTimeout(resource, options) {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
}

async function loadMovies() {
  try {
    let delay = setTimeout(() => {
      log(`Loading movies... for key words : ${keyWords.value}`);
    }, 6000);
    const response = await fetchWithTimeout(`http://www.omdbapi.com/?s=${encodeURIComponent(keyWords.value)}&apikey=ce0e87a6`, {
      timeout: 6000
    });
    //console.log(response);
    clearTimeout(delay);
    if (response.ok) {
      const responseJson = await response.json();
      const posts = JSON.stringify(responseJson);
      console.log(`posts: ${posts}`);
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
  loadMovies().then(function(res) {
    designDiv.innerHTML = "";
    if (res !== null && res !== undefined) {
      //console.log(`res: ${JSON.stringify(res)}`);
      const results = res.Search;
      const totalResults = results.length;
      log(`${totalResults} Movie${totalResults > 1 ? "s have to " : " has to "} be loaded.`);
      //console.log(`Fetched results: ${JSON.stringify(results)}`);
      results.map((result) => searchMovie(designDiv, result.Poster, result.Title, result.Year, result.imdbID, result.Type));
      log(`${totalResults} Movie${totalResults > 1 ? "s have " : " has "} been loaded.`);
    }
  });
});

function log(message) {
  document.getElementById("message").innerText = message;
}

async function searchMovie(selector, URL, title, year, imdbID, imdbType) {
  if (imdbID !== null && imdbID !== undefined) {
    try {
      let delay = setTimeout(() => {
        log(`Loading movie... for Id : ${imdbID}`);
      }, 6000);
      const response = await fetchWithTimeout(`http://www.omdbapi.com/?i=${imdbID}&apikey=ce0e87a6`, {
        timeout: 6000
      });
      //console.log(response);
      clearTimeout(delay);
      if (response.ok) {
        const responseJson = await response.json();
        const post = JSON.stringify(responseJson);
        console.log(`post: ${post}`);
        responseJson.then(showMovie(designDiv, responseJson.Poster, responseJson.Title, responseJson.Released, responseJson.Plot, responseJson.imdbID, responseJson.Type));
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
