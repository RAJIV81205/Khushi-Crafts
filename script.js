function hideLoader() {
    const loaderContainer = document.getElementById('loader-container');
    loaderContainer.style.display = 'none';
}

// Add event listener for the window load event
window.addEventListener('load', hideLoader);