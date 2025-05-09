// Função que será executada quando o script for carregado
function initializePage() {
  // Verificamos se o usuário está autenticado
  verifyAuth();
  
  // Configuramos um observador para detectar quando o conteúdo do perfil é carregado
  setDOMObserver();
}

// Verifica se o usuário está autenticado
function verifyAuth() {
  let token = localStorage.getItem("token");
  
  if (!token) {
    window.location.href = "login.html";
    return;
  }
}

// Configura um observador para detectar mudanças no DOM
function setDOMObserver() {
  // Seleciona o elemento main ou o container onde o conteúdo será carregado
  const targetNode = document.querySelector("main") || document.getElementById("content") || document.body;
  
  // Flag para controlar se já estamos processando uma mudança
  let isProcessing = false;
  
  // Timestamp da última requisição para evitar chamadas repetidas
  let lastRequestTime = 0;
  const minTimeBetweenRequests = 1000; // 1 segundo de intervalo mínimo
  
  // Configuração do observador
  const config = { childList: true, subtree: true };
  
  // Callback para quando mudanças são detectadas
  const callback = function(mutationsList, observer) {
    // Evita processar múltiplas mudanças simultaneamente
    if (isProcessing) return;
    
    // Verifica o intervalo mínimo entre requisições
    const now = Date.now();
    if (now - lastRequestTime < minTimeBetweenRequests) return;
    
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Verifica se os elementos de perfil existem no DOM
        if (document.getElementById("fname") || 
            document.getElementById("sname") || 
            document.getElementById("displayName")) {
          
          // Se o observador detectou os elementos do perfil, precisamos verificar
          // se eles já estão preenchidos ou se precisam ser atualizados
          const displayNameElement = document.getElementById("displayName");
          
          // Se o elemento já tem conteúdo, assumimos que já foi preenchido
          if (displayNameElement && displayNameElement.textContent && 
              displayNameElement.textContent !== "Não informado" && 
              displayNameElement.textContent.trim() !== "") {
            console.log("Elementos de perfil já estão preenchidos.");
            return;
          }
          
          // Se encontrou algum dos elementos vazios, carrega os dados
          console.log("Elementos de perfil detectados no DOM. Carregando dados...");
          
          // Define flags para evitar processamento duplo
          isProcessing = true;
          lastRequestTime = now;
          
          getUserInformation();
          
          // Reseta a flag após um tempo
          setTimeout(() => {
            isProcessing = false;
          }, 500);
          
          break;
        }
      }
    }
  };
  
  // Cria e inicia o observador
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  
  // Como backup, também verifica se já existe conteúdo carregado
  if (document.getElementById("fname") || 
      document.getElementById("sname") || 
      document.getElementById("displayName")) {
    
    // Verificamos se os elementos já têm conteúdo
    const displayNameElement = document.getElementById("displayName");
    if (displayNameElement && displayNameElement.textContent && 
        displayNameElement.textContent !== "Não informado" && 
        displayNameElement.textContent.trim() !== "") {
      console.log("Elementos de perfil já existem e estão preenchidos.");
      return;
    }
    
    console.log("Elementos de perfil já existem no DOM. Carregando dados...");
    getUserInformation();
  }
}

// Função para obter informações do usuário
function getUserInformation() {
  let token = localStorage.getItem("token");
  
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  
  let url = "http://localhost:5000/users/profile";
  let request = {
    method: "GET",
    headers: {
      Authorization: token,
    },
  };
  
  fetch(url, request)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("admin");
          
          window.location.href = "login.html";
          return Promise.reject(
            "Sessão expirada. Por favor, faça login novamente."
          );
        }
        return Promise.reject("Erro ao buscar dados do usuário");
      }
      return response.json();
    })
    .then((userData) => {
      console.log("Dados do usuário recebidos:", userData);
      displayUserData(userData);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados do usuário: ", error);
    });
}

// Função para exibir os dados do usuário na página
function displayUserData(userData) {
  console.log("Atualizando elementos da UI com dados do usuário");
  
  const fnameElement = document.getElementById("fname");
  if (fnameElement) {
    fnameElement.textContent = userData.fname || "Não informado";
    fnameElement.style.color = "#5A6466";
    console.log("Elemento fname atualizado!");
  } else {
    console.warn("Elemento fname não encontrado no DOM");
  }
  
  const snameElement = document.getElementById("sname");
  if (snameElement) {
    snameElement.textContent = userData.sname || "Não informado";
    snameElement.style.color = "#5A6466";
    console.log("Elemento sname atualizado!");
  } else {
    console.warn("Elemento sname não encontrado no DOM");
  }
  
  const bdateElement = document.getElementById("bdate");
  if (bdateElement) {
    bdateElement.textContent = userData.bdate || "Não informado";
    bdateElement.style.color = "#5A6466";
    console.log("Elemento bdate atualizado!");
  } else {
    console.warn("Elemento bdate não encontrado no DOM");
  }
  
  const displayNameElement = document.getElementById("displayName");
  if (displayNameElement) {
    displayNameElement.textContent = userData.username || "Não informado";
    displayNameElement.style.color = "#5A6466";
    console.log("Elemento displayName atualizado!");
  } else {
    console.warn("Elemento displayName não encontrado no DOM");
  }
  
  const emailElement = document.getElementById("email");
  if (emailElement) {
    emailElement.textContent = userData.email || "Não informado";
    emailElement.style.color = "#5A6466";
    console.log("Elemento email atualizado!");
  } else {
    console.warn("Elemento email não encontrado no DOM");
  }
}

// Função para fazer logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  window.location.href = "login.html";
}

// Função para editar dados do usuário
function editUserData() {
  alert("Funcionalidade de edição em desenvolvimento");
}



// Inicia o processo quando o script é carregado
initializePage();