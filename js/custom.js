const keyWords = document.getElementById("keyWords");
const loadButton = document.getElementById("load-button");
const designDiv = document.getElementById("design-div");
// Get the modal
const modal = document.getElementById("myModal");
const modalDiv = document.getElementById("myModal-div");
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

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
  }, 6000);
  loadMovies().then(function(res) {
    designDiv.innerHTML = "";
    log("");
    clearTimeout(delay);
    if (res !== null && res !== undefined) {
      //console.log(`res: ${JSON.stringify(res)}`);
      const results = res.Search;
      if (results !== null && results !== undefined) {
        const totalResults = results.length;
        //console.log(`Fetched results: ${JSON.stringify(results)}`);
        delay = setTimeout(() => {
	  log(`${totalResults} Movie${totalResults > 1 ? "s have to " : " has to "} be loaded.`);
        }, 6000);
        clearTimeout(delay);
        results.map((result) => searchMovie(designDiv, result.Poster, result.Title, result.Year, result.imdbID, result.Type));
        log(`${totalResults} Movie${totalResults > 1 ? "s have " : " has "} been loaded.`);
      } else {
        log("None movie was found with these key words!");
      }
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
    }, 6000);
    loadMovie(imdbID).then(function(res) {
      clearTimeout(delay);
      if (res !== null && res !== undefined) {
        //console.log(`res: ${JSON.stringify(res)}`);
        showMovie(designDiv, res.Poster, res.Title, res.Released, res.Plot, res.imdbID, res.Type);
      } else {
        log("None movie was found with this Id!");
      }
    });
  }
}

async function loadMovie(imdbID) {
  if (imdbID !== null && imdbID !== undefined) {
    try {
      const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=ce0e87a6`);
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
        <img class="image-carte" src='${URL}' alt='${title}'/>
        <div style="text-align: center;margin-top: 5px;">
          <button class="btn btn-dark" id="read-more-button" onClick="invokeModal(event)" data-arg1='${URL}' data-arg2='${title}' data-arg3='${released}' data-arg4='${plot}'>Read More</button>
        </div>
      </div>
    </div>
  `;
}

const invokeModal = (event) => {
  console.log(event);
  const URL = event.target.getAttribute('data-arg1');
  const title = event.target.getAttribute('data-arg2');
  const released = event.target.getAttribute('data-arg3');
  const plot = event.target.getAttribute('data-arg4');
  modalDiv.innerHTML = `
    <div class="carte">
      <h4>${title}</h4>
      <p>${released}</p>
      <p>${plot}</p>
      <img class="image-carte" src='${URL}' alt='${title}'/>
    </div>
  `;
  // When the user clicks on the button, open the modal
  modal.style.display = "grid";
}
