// Função melhorada para adicionar um novo livro ao banco de dados
function addBook() {
  // Capturar os valores do formulário
  const title = document.getElementById('book-title').value;
  const synopsis = document.getElementById('book-synopsis').value;
  const pages = document.getElementById('book-pages').value;
  const authorId = document.getElementById('author-selection').value;
  const genreId = document.getElementById('genre-selection').value;
  
  // Obter o ID do usuário do localStorage
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  if (!userId || !token) {
    alert('Você precisa estar logado para adicionar um livro.');
    return;
  }

  // Verificar se todos os campos obrigatórios foram preenchidos
  if (!title.trim()) {
    alert('Por favor, informe o título do livro.');
    return;
  }
  
  if (!synopsis.trim()) {
    alert('Por favor, adicione uma sinopse para o livro.');
    return;
  }
  
  if (!authorId) {
    alert('Por favor, selecione um autor.');
    return;
  }
  
  if (!genreId) {
    alert('Por favor, selecione um gênero.');
    return;
  }

  // Preparar os dados para envio - Garantindo consistência com o backend
  const bookData = {
    title: title,
    synopsis: synopsis,
    pages: pages ? parseInt(pages) : 0, // Garantir que seja número ou 0
    author_id: parseInt(authorId),
    genre_id: parseInt(genreId),
    user_id: parseInt(userId)
  };

  // Log detalhado para depuração
  console.log("Enviando dados do livro:", JSON.stringify(bookData, null, 2));

  // Configurar a requisição
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bookData)
  };

  // Exibir feedback visual de que a solicitação está em andamento
  const addButton = document.querySelector('.add-btn');
  if (addButton) {
    addButton.textContent = 'Enviando...';
    addButton.disabled = true;
  }

  // Enviar a requisição
  fetch('http://localhost:5000/books/', requestOptions)
    .then(response => {
      // Primeiro, vamos logar informações da resposta para depuração
      console.log("Status da resposta:", response.status);
      console.log("Headers da resposta:", [...response.headers.entries()]);
      
      // Verificar se o content-type é json antes de tentar parsear
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json().then(data => {
          console.log("Dados da resposta:", data);
          
          if (!response.ok) {
            throw new Error(data.error || `Erro HTTP! Status: ${response.status}`);
          }
          
          return data;
        });
      } else {
        // Se não for JSON, tratar como texto
        return response.text().then(text => {
          console.log("Resposta (texto):", text);
          
          if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
          }
          
          return { message: text };
        });
      }
    })
    .then(data => {
      alert("Livro adicionado com sucesso!")
      // Fechar o modal e limpar o formulário
      closeModal();
      fetchBooks();     
      // Recarregar a lista de livros se estivermos na página da biblioteca
      if (window.location.hash === '#library' || 
          localStorage.getItem('currentSection') === 'library') {
        fetchBooks();
      }
    })
    .catch(error => {
      console.error('Erro ao adicionar livro:', error);
      // Exibir mensagem de erro mais específica e não duplicada
      const errorMsg = error.message || 'Por favor, tente novamente.';
      alert(`Erro ao adicionar livro: ${errorMsg}`);
    })
    .finally(() => {
      // Restaurar o botão
      if (addButton) {
        addButton.textContent = 'Adicionar';
        addButton.disabled = false;
      }
    });
}