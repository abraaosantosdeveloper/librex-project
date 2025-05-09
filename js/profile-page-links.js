function selectPage(section){
    fetch(`./main_content/${section}_main.html`)
    .then(response => response.text())
    .then(html => {
        document.getElementById("content").innerHTML = html;
        
        // Importante: Esperar um momento para o DOM ser atualizado
 
            if (section === 'bookshelf'){
                fetchBooks();
            } else if (section === 'favorites'){
                fetchFavoriteBooks();
            }
    })
    .catch(error => {
        console.error(`Erro ao carregar a página ${section}:`, error);
    });
    closeMenu();
}

window.addEventListener('load', () => {
    selectPage('bookshelf');
});


function openMenu(){
    let menu = document.getElementById('lateral-menu');
    menu.classList.add('active-menu');
}

function closeMenu(){
    let menu = document.getElementById('lateral-menu');
    
    menu.classList.remove('active-menu');
}