function login() {
  const email = document.getElementById("email_field").value;
  const password = document.getElementById("password_field").value;
  const errorLabel = document.getElementById("error");
  
  if (!email || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }
  
  let url = "http://localhost:5000/login";
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  
  fetch(url, request)
    .then((response) => {
      return response.json().then((body) => {
        return {status: response.status, ...body};
      });
    })
    .then((data) => {
      console.log(data);
      
      if (data.status === 401) {
        if (data.error) {
          errorLabel.style.display = "block";
          document.getElementById('password_field').value = "";
        }
        return;
      }
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", data.admin);
      localStorage.setItem("userId", data.userId);
      
      
      if (parseInt(data.admin) === 1) {
        window.location.href = "admin_panel.html";
      } else {
        window.location.href = "profile.html";
      }
    })
    .catch((err) => {
      console.error("Erro ao fazer login:", err);
    });
}

// Função para decodificar o token JWT
function parseJwt(token) {
  try {
    // O token JWT é dividido em três partes separadas por pontos: header.payload.signature
    // Pegamos a parte do meio (payload) e decodificamos
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return {};
  }
}

function hideMessage(){
  let errorLabel = document.getElementById("error");
  errorLabel.style.display = "none";
}