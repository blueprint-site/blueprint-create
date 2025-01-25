const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    window.localStorage.setItem('darkmode', body.classList.contains('dark-mode'));
});
window.addEventListener('load', function () {
    if (window.localStorage.getItem("darkmode")) {
        if (window.localStorage.getItem("darkmode") == "true") document.body.classList.add('dark-mode');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        window.localStorage.setItem('darkmode', true);
    }
});
