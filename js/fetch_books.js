  function fetchBooksNoSection() {
    const url = "http://localhost:5000/books";
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na resposta: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        data.sort((a, b) => a.title.localeCompare(b.title));
        // Encontre o elemento do catálogo
        const bookshelf = document.getElementById("catalog");
        
        
        if (!bookshelf) {
          console.error("Elemento 'catalog' não encontrado no DOM!");
          return;
        }
        
        // Limpe o catálogo antes de adicionar novos cards
        bookshelf.innerHTML = "";
        
        // Crie um card para cada livro
        data.forEach(book => {
          const card = document.createElement("div");
          card.className = "book-card";
          
          const cardCover = document.createElement("div");
          cardCover.className = "cover";
          
          const content = document.createElement("div");
          content.className = "content";
          
          const bookTitle = document.createElement("h3");
          bookTitle.className = "book-title";
          bookTitle.textContent = book.title;
          
          const authorInfo = document.createElement("p");
          authorInfo.className = "author";
          authorInfo.textContent = `Autor: ${book.author}`;
          
          const synopsisInfo = document.createElement("p");
          synopsisInfo.className = "synopsis";
          synopsisInfo.textContent = book.synopsis;
          
          const genreInfo = document.createElement("p");
          genreInfo.className = "genre";
          genreInfo.textContent = `Gênero: ${book.genre}`;

          
          
          const aboutBtn = document.createElement("button");
          aboutBtn.className = "about-btn";
          aboutBtn.textContent = "Detalhes";
          aboutBtn.onclick = () => {
            openBookModal(book.title, book.synopsis);
            setTimeout(() => fetchEvaluations(book.id), 200);

            
          };
          
          // Montar a estrutura do card
          content.appendChild(bookTitle);
          content.appendChild(authorInfo);
          content.appendChild(synopsisInfo);
          content.appendChild(genreInfo);
          content.appendChild(aboutBtn);
          
          card.appendChild(cardCover);
          card.appendChild(content);
          
          // Adicionar card ao catálogo
          bookshelf.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Erro ao buscar livros:", error);
        const bookshelf = document.getElementById("personal-catalog");
        if (bookshelf) {
          bookshelf.innerHTML = `<p>Erro ao carregar livros: ${error.message}</p>`;
        }
      });
  }



// Função para buscar e exibir livros com status de favorito
function fetchBooks() {
  const url = "http://localhost:5000/books";
  const favoritesUrl = "http://localhost:5000/books/favorites/list";
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  console.log("ID do usuário obtido:", userId);
  
  // Buscamos todos os livros
  fetch(url, {
    headers: {
      'Authorization': token
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`);
      }
      return response.json();
    })
    .then(books => {
      console.log("Livros recebidos:", books);
      
      // Buscamos a lista de favoritos se houver usuário autenticado
      if (token) {
        return fetch(favoritesUrl, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
          .then(favResponse => {
            if (!favResponse.ok) {
              console.warn("Não foi possível carregar os favoritos, continuando sem eles");
              return { books, favorites: [] };
            }
            return favResponse.json().then(favoritesData => {
              console.log("Favoritos recebidos:", favoritesData);
              return { books, favorites: favoritesData.favorites || [] };
            });
          })
          .catch(error => {
            console.warn("Erro ao carregar favoritos:", error);
            return { books, favorites: [] };
          });
      } else {
        console.log("Usuário não autenticado, não buscando favoritos");
        return { books, favorites: [] };
      }
    })
    .then(data => {
      const { books, favorites } = data;
      const favoriteIds = new Set(favorites);
      
      // Marcar livros favoritos
      books.forEach(book => {
        book.favorite = favoriteIds.has(book.id);
      });
      

      
      // Renderizar os livros
        renderBookCatalog(books);
    })
    .catch(error => {
      console.error("Erro ao buscar livros:", error);
      const bookshelf = document.getElementById("catalog");
      if (bookshelf) {
        bookshelf.innerHTML = `<p>Erro ao carregar livros: ${error.message}</p>`;
      }
    });
}

// Função para renderizar o catálogo de livros
function renderBookCatalog(books) {
  const bookshelf = document.getElementById("catalog");
  
  if (!bookshelf) {
    console.error("Elemento 'catalog' não encontrado no DOM!");
    return;
  }
  
  // Limpe o catálogo antes de adicionar novos cards
  bookshelf.innerHTML = "";
  
  // Crie um card para cada livro
  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    
    const cardCover = document.createElement("div");
    cardCover.className = "cover";
    
    const content = document.createElement("div");
    content.className = "content";
    
    const bookTitle = document.createElement("h3");
    bookTitle.className = "book-title";
    bookTitle.textContent = book.title;
    
    const authorInfo = document.createElement("p");
    authorInfo.className = "author";
    authorInfo.textContent = `Autor: ${book.author}`;
    
    const synopsisInfo = document.createElement("p");
    synopsisInfo.className = "synopsis";
    synopsisInfo.textContent = book.synopsis;
    
    const genreInfo = document.createElement("p");
    genreInfo.className = "genre";
    genreInfo.textContent = `Gênero: ${book.genre}`;
    
    // Criar e adicionar o ícone de favorito com estado inicial correto
    const favoriteIcon = document.createElement("div");
    favoriteIcon.className = book.favorite ? "starred" : "not-starred";
    favoriteIcon.setAttribute("data-book-id", book.id);
    favoriteIcon.onclick = function(event) {
      event.stopPropagation(); // Evita que o card inteiro seja clicado
      toggleFavorite(book.id, this);
    };

    const deleteIcon = document.createElement('div');
    deleteIcon.className = 'delete-btn';
    deleteIcon.setAttribute("data-book-id", book.id);
    deleteIcon.onclick = function(event){
      event.stopPropagation();
      deleteBook(book.id);
      console.log("Livro apagado...")
    }
    
    const aboutBtn = document.createElement("button");
    aboutBtn.className = "about-btn";
    aboutBtn.textContent = "Detalhes";
    aboutBtn.onclick = () => {
      openBookModal(book.title, book.synopsis);
      fetchEvaluations(book.id);
    };
    
    // Montar a estrutura do card
    content.appendChild(bookTitle);
    content.appendChild(authorInfo);
    content.appendChild(synopsisInfo);
    content.appendChild(genreInfo);
    content.appendChild(aboutBtn);
    
    card.appendChild(cardCover);
    card.appendChild(content);
    card.appendChild(favoriteIcon);
    card.appendChild(deleteIcon);
    
    // Adicionar card ao catálogo
    bookshelf.appendChild(card);
  });
}



// Função independente para alternar favoritos
function toggleFavorite(bookId, iconElement) {
  const url = `http://localhost:5000/books/favorite/${bookId}`;
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (!token) {
    console.error("Usuário não autenticado");
    alert("Você precisa estar logado para adicionar favoritos");
    return;
  }
  
  console.log(`Alterando favorito para livro ID ${bookId}, usuário ID ${userId}`);
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': token,
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Atualiza a UI com base na resposta do servidor
      iconElement.className = data.favorite ? "starred" : "not-starred";
      console.log(`Livro ${bookId} ${data.favorite ? 'adicionado aos' : 'removido dos'} favoritos`);
    })
    .catch(error => {
      console.error("Erro ao alternar favorito:", error);
      // Você pode adicionar uma notificação de erro aqui
      alert(`Erro ao alternar favorito: ${error.message}`);
    });
}

function deleteBook(bookId) {
  const url = `http://localhost:5000/books/delete/${bookId}`;
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (!token) {
    console.error("Usuário não autenticado");
    alert("Você precisa estar logado para excluir um livro");
    return;
  }
  
  console.log(`Apagando livro com ID ${bookId}, usuário com ID ${userId}`);
  
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': token,
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data.message);
      fetchBooks();
    })
    .catch(error => {
      console.error("Erro ao apagar livro:", error);
      // Você pode adicionar uma notificação de erro aqui
      alert(`Erro ao apagar livro: ${error.message}`);
    });
}

function openBookModal(title, synopsis){

  let modal = document.getElementById('book_info_modal');
  modal.style.display = "flex"
  let bookTitle = document.getElementById('title-in-modal');
  let bookSynopsis = document.getElementById('synopsis-in-modal');
  let close = document.getElementById('close');

  bookTitle.textContent = title;
  bookSynopsis.textContent = synopsis;

  close.onclick = () => {
    modal.style.display = "none"
  }

}

function fetchEvaluations(bookId) {
  const url = `http://localhost:5000/books/evaluations/${bookId}`;
  const token = localStorage.getItem('token');

  const evaluationsContainer = document.getElementById('evaluations-list');
  evaluationsContainer.innerHTML = "<p>Carregando avaliações...</p>";

  fetch(url, {
    headers: {
      'Authorization': token
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`);
      }
      return response.json();
    })
    .then(evaluations => {
      if (!evaluationsContainer) {
        console.warn("Container de avaliações não encontrado!");
        return;
      }


      if (evaluations.length === 0) {
        evaluationsContainer.innerHTML = "<p>Este livro ainda não possui avaliações.</p>";
        return;
      }
      evaluationsContainer.innerHTML = "";
      evaluations.forEach(evaluation => {
        const evalDiv = document.createElement("div");
        evalDiv.className = "evaluation";

        

        evalDiv.innerHTML = `<div class="user-eval-info">
          <strong>${evaluation.username}</strong>
          <span class="rating">Nota: ${evaluation.rating}/10</span>
          </div>
          <p>${evaluation.comment}</p>
          <small>${new Date(evaluation.date).toLocaleDateString()}</small>
        `;

        evaluationsContainer.appendChild(evalDiv);
      });
    })
    .catch(error => {
      console.error("Erro ao buscar avaliações:", error);
      const evaluationsContainer = document.getElementById('evaluations-list');
      if (evaluationsContainer) {
        evaluationsContainer.innerHTML = `<p>Erro ao carregar avaliações: ${error.message}</p>`;
      }
    });

}

function insertComment(){
  alert("Em desenvolvimento...")
}

