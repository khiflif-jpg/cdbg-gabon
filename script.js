document.querySelector('form').addEventListener('submit', function(e) {
    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const sujet = document.getElementById('sujet').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!nom || !email || !sujet || !message) {
        alert('Merci de remplir tous les champs.');
        e.preventDefault();
    }
});

