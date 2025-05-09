window.addEventListener("DOMContentLoaded", () => {
  // Garante que o tema salvo será aplicado no carregamento
  // const link = document.getElementById("css-file");
  // const savedTheme = localStorage.getItem("theme");
  // if (savedTheme) {
  //   link.href = savedTheme;
  // }

  // Dá tempo do CSS carregar antes de exibir
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 200); // 200ms costuma ser o suficiente
});

function userNameChange(){
  let displayname = document.getElementById('displayname');
  let username = document.getElementById('username').value;
  displayname.innerHTML = username;

  if(!username){
    displayname.innerHTML = "Nome de Usuário"
  }
  
}
function signup() {
  let fname = document.getElementById("fname").value;
  let sname = document.getElementById("sname").value;
  let bdate = document.getElementById("bdate").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let displayname = document.getElementById("username").value;
  
  // Mostrar no console os dados que estamos enviando (para debug)
  console.log("Enviando dados:", { fname, sname, bdate, email, password: "***", displayname });
  
  let url = "http://localhost:5000/users/register";
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fname, sname, bdate, email, password, displayname }),
  };
  
  fetch(url, request)
    .then((response) => {
      console.log("Status da resposta:", response.status);
      return response.json().then((body) => {
        return {status: response.status, ...body};
      }).catch(error => {
        console.error("Erro ao fazer parse do JSON:", error);
        throw new Error("Erro ao processar resposta do servidor");
      });
    })
    .then((data) => {
      console.log("Dados recebidos:", data);
      
      if (data.status === 201) {
        // Salvar o token e status de admin no localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("admin", data.admin);
        
        // Exibir mensagem de sucesso
        alert("Cadastro realizado com sucesso!");
        
        // Redirecionar com base no status de admin
        if (parseInt(data.admin) === 1) {
          window.location.href = "admin_panel.html";
        } else {
          window.location.href = "profile.html";
        }
      } else if (data.error) {
        // Exibir mensagem de erro
        let errorLabel = document.getElementById("errorLabel");
        if (errorLabel) {
          errorLabel.style.display = "block";
          errorLabel.innerText = data.error;
        }
        // Limpar a senha
        document.getElementById("password").value = "";
      }
    })
    .catch((err) => {
      console.error("Erro ao fazer cadastro:", err);
      
      // Exibir mensagem de erro genérica
      let errorLabel = document.getElementById("errorLabel");
      if (errorLabel) {
        errorLabel.style.display = "block";
        errorLabel.innerText = "Erro ao processar o cadastro. Tente novamente.";
      }
    });
}

function hideMessage(){
  let errorLabel = document.getElementById("error");
  errorLabel.style.display = "none";
}

function checkPasswordStrength() {
  const password = document.getElementById("password").value;
  const strengthText = document.getElementById("passwordStrengthText");

  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  const hasNumber = /\d/.test(password);
  const isLongEnough = password.length >= 6;

  let strength = '';
  let color = ''; 

  if (!isLongEnough) {
    if (hasNumber || hasSpecialChar) {
      strength = 'Fraca';
      color = 'red';
    } else {
      strength = 'Fraca';
      color = 'red';
    }
  } else if (hasNumber || hasSpecialChar || hasUppercase) {
    strength = 'Média';
    color = 'orange';
  } else if (hasNumber && hasSpecialChar && hasUppercase) {
    strength = 'Forte';
    color = 'green';
  } else {
    strength = 'Fraca';
    color = 'red';
  }

  strengthText.textContent = `Nível da senha: ${strength}`;
  strengthText.style.color = color;
  if(!password){
    strengthText.textContent = "" 
  }
}