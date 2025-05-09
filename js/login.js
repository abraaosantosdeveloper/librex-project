window.addEventListener("DOMContentLoaded", () => {
    // Garante que o tema salvo será aplicado no carregamento
    const link = document.getElementById("css-file");
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      link.href = savedTheme;
    }

    // Dá tempo do CSS carregar antes de exibir
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 200); // 200ms costuma ser o suficiente
  });

  function changeTheme() {
    const link = document.getElementById("css-file");
    let theme =
      localStorage.getItem("theme") || "./css/light-login.css";
    const newTheme =
      theme === "./css/light-login.css"
        ? "./css/dark-login.css"
        : "./css/light-login.css";

    // Transição suave
    document.body.style.opacity = "0";
    setTimeout(() => {
      link.href = newTheme;
      localStorage.setItem("theme", newTheme);
    }, 100); // Dá tempo da opacidade sumir

    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 300); // Retorna com transição após o novo CSS aplicar
  }