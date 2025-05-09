function openModal() {
  let modal = document.getElementById("modal");
  modal.classList.add("active");

  // Limpa os selects antes de popular (evita duplicatas se abrir mais de uma vez)
  clearSelect('genre-selection');
  clearSelect('author-selection');

  // Mostra placeholders enquanto carrega
  insertPlaceholder('genre-selection', 'Carregando gêneros...');
  insertPlaceholder('author-selection', 'Carregando autores...');

  // Carrega dados em segundo plano
  fetchGenders();
  fetchAuthors();
}

function closeModal() {
  let modal = document.getElementById("modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function clearSelect(selectId) {
  let select = document.getElementById(selectId);
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
}

function insertPlaceholder(selectId, text) {
  let select = document.getElementById(selectId);
  let option = document.createElement('option');
  option.textContent = text;
  option.disabled = true;
  option.selected = true;
  select.appendChild(option);
}

function fetchGenders() {
  fetch('http://localhost:5000/genres')
    .then(response => response.json())
    .then(genres => {
      let genreSelection = document.getElementById('genre-selection');
      clearSelect('genre-selection');
      genres.forEach(genre => {
        let option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.genre;
        genreSelection.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar os gêneros: ", error);
      insertPlaceholder('genre-selection', 'Erro ao carregar');
    });
}

function fetchAuthors() {
  fetch('http://localhost:5000/authors')
    .then(response => response.json())
    .then(authors => {
      let authorSelection = document.getElementById('author-selection');
      clearSelect('author-selection');
      authors.forEach(author => {
        let option = document.createElement('option');
        option.value = author.id;
        option.textContent = author.name;
        authorSelection.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar os autores: ", error);
      insertPlaceholder('author-selection', 'Erro ao carregar');
    });
}
