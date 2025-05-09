// Função para carregar mensagens do usuário logado
function loadUserMessages() {
  // Obter o token e o ID do usuário
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (!token || !userId) {
    console.error('Usuário não autenticado');
    return;
  }
  
  // Configurar a requisição
  const requestOptions = {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  // Fazer a requisição para obter as mensagens
  fetch(`http://localhost:5000/messages/user/${userId}`, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(messages => {
      displayMessages(messages);
    })
    .catch(error => {
      console.error('Erro ao carregar mensagens:', error);
      const inboxContainer = document.getElementById('inbox-container');
      if (inboxContainer) {
        inboxContainer.innerHTML = '<p class="error-message">Erro ao carregar mensagens. Por favor, tente novamente mais tarde.</p>';
      }
    });
}

// Função para exibir as mensagens na página
function displayMessages(messages) {
  // Selecionar o container de mensagens
  const inboxContainer = document.getElementById('inbox-container');
  
  if (!inboxContainer) {
    console.error('Container de mensagens não encontrado');
    return;
  }
  
  // Limpar o conteúdo atual
  inboxContainer.innerHTML = '';
  
  // Verificar se há mensagens
  if (!messages || messages.length === 0) {
    inboxContainer.innerHTML = '<p class="no-messages">Você não tem mensagens.</p>';
    return;
  }
  
  // Criar a estrutura HTML para as mensagens
  const messagesList = document.createElement('div');
  messagesList.className = 'messages-list';
  
  // Adicionar cada mensagem à lista
  messages.forEach(message => {
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    
    // Verificar se é uma mensagem de aprovação de livro
    const isBookApproval = message.title.includes('aprovação') && message.content.includes('ID');
    
    // Criar a estrutura básica da mensagem
    let messageHTML = `
      <div class="message-header">
        <h3 class="message-title">${message.title}</h3>
        <span class="message-date">${message.formatted_date}</span>
      </div>
      <div class="message-sender">De: ${message.sender_name}</div>
      <div class="message-content">${message.content}</div>
    `;
    
    // Se for uma mensagem de aprovação de livro e o usuário for admin, adicionar botões
    if (isBookApproval && localStorage.getItem('admin') === '1') {
      const bookId = extractBookId(message.content);
      
      messageHTML += `
        <div class="approval-actions">
          <button class="approve-btn" onclick="approveBook(${bookId}, ${message.id})">Aprovar</button>
          <button class="reject-btn" onclick="showRejectDialog(${bookId}, ${message.id})">Rejeitar</button>
        </div>
      `;
    }
    
    // Adicionar o HTML à mensagem
    messageItem.innerHTML = messageHTML;
    messagesList.appendChild(messageItem);
  });
  
  // Adicionar a lista ao container
  inboxContainer.appendChild(messagesList);
}

// Função para extrair o ID do livro do conteúdo da mensagem
function extractBookId(content) {
  // Padrão: procura por "ID" seguido de números
  const match = content.match(/ID\s+(\d+)/i);
  return match ? match[1] : null;
}

// Função para aprovar um livro
function approveBook(bookId, messageId) {
  if (!bookId) {
    alert('ID do livro não encontrado na mensagem');
    return;
  }
  
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (!token || !userId) {
    alert('Você precisa estar logado para realizar esta ação');
    return;
  }
  
  // Preparar os dados para envio
  const data = {
    user_id: parseInt(userId)
  };
  
  // Configurar a requisição
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  };
  
  // Enviar a requisição
  fetch(`http://localhost:5000/books/${bookId}/approve`, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      alert('Livro aprovado com sucesso!');
      // Recarregar as mensagens
      loadUserMessages();
    })
    .catch(error => {
      console.error('Erro ao aprovar livro:', error);
      alert('Erro ao aprovar livro. Por favor, tente novamente.');
    });
}

// Função para mostrar o diálogo de rejeição
function showRejectDialog(bookId, messageId) {
  if (!bookId) {
    alert('ID do livro não encontrado na mensagem');
    return;
  }
  
  const reason = prompt('Por favor, informe o motivo da rejeição:');
  
  if (reason === null) {
    // Usuário cancelou
    return;
  }
  
  if (reason.trim() === '') {
    alert('Por favor, informe um motivo para a rejeição');
    return showRejectDialog(bookId, messageId);
  }
  
  rejectBook(bookId, messageId, reason);
}

// Função para rejeitar um livro
function rejectBook(bookId, messageId, reason) {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (!token || !userId) {
    alert('Você precisa estar logado para realizar esta ação');
    return;
  }
  
  // Preparar os dados para envio
  const data = {
    user_id: parseInt(userId),
    reason: reason
  };
  
  // Configurar a requisição
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  };
  
  // Enviar a requisição
  fetch(`http://localhost:5000/books/${bookId}/reject`, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      alert('Livro rejeitado com sucesso!');
      // Recarregar as mensagens
      loadUserMessages();
    })
    .catch(error => {
      console.error('Erro ao rejeitar livro:', error);
      alert('Erro ao rejeitar livro. Por favor, tente novamente.');
    });
}

// Função para criar o conteúdo da página de caixa de entrada
function renderInboxPage() {
  const contentDiv = document.getElementById('content');
  
  if (!contentDiv) {
    console.error('Container de conteúdo não encontrado');
    return;
  }
  
  // Criar estrutura da página de caixa de entrada
  contentDiv.innerHTML = `
    <h1 class="title">Caixa de Entrada</h1>
    <div id="inbox-container" class="inbox-container">
      <p class="loading">Carregando mensagens...</p>
    </div>
  `;
  
  // Carregar as mensagens
  loadUserMessages();
}

// Verificar se estamos na página da caixa de entrada quando o script é carregado
document.addEventListener('DOMContentLoaded', function() {
  // Verificar se há um parâmetro na URL indicando a seção atual
  const currentSection = window.location.hash.replace('#', '') || 
                        localStorage.getItem('currentSection') || 
                        'profile';
  
  if (currentSection === 'inbox') {
    renderInboxPage();
  }
  
  // Adicionar listener para alterar conteúdo quando a seção for alterada
  window.addEventListener('hashchange', function() {
    const newSection = window.location.hash.replace('#', '');
    if (newSection === 'inbox') {
      renderInboxPage();
    }
  });
});

// Função para ser chamada quando o usuário clicar na seção de caixa de entrada
function showInbox() {
  renderInboxPage();
  localStorage.setItem('currentSection', 'inbox');
  window.location.hash = 'inbox';
}