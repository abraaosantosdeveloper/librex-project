function validateTokenAdmin(){
  const token = localStorage.getItem("token");
  const isAdmin = parseInt(localStorage.getItem("admin"));

  if (!token || isNaN(isAdmin)) {
      
      window.location.href = "login.html";

  } else if (isAdmin !== 1) {
    
    localStorage.removeItem('admin');
    window.location.href = "login.html";

  }
}