const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Make hamburger keyboard accessible
navToggle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navToggle.click();
    }
});

// Login page

function closePopup() {
    document.getElementById('loginPopup').style.display = 'none';
  }
  
window.onload = function() {
    // Check if the user is already logged in
    if (!localStorage.getItem("isLoggedIn")) {
        setTimeout(showPopup, 4000); // Show popup after 4 seconds
    }
};

function showPopup() {
    document.getElementById("loginPopup").style.display = "flex"; // Use flex to center
}

function closePopup() {
    document.getElementById("loginPopup").style.display = "none";
}

// Function to handle login
function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    // Here you would typically validate the login credentials
    // For demonstration, we will assume login is successful

    // Set the logged-in flag in local storage
    localStorage.setItem("isLoggedIn", "true");

    // Close the popup
    closePopup();
}

// Attach the handleLogin function to the form submission
document.querySelector("form").addEventListener("submit", handleLogin);

function logout() {
    localStorage.removeItem("isLoggedIn");
    // Optionally, you can show the popup again
    setTimeout(showPopup, 4000);
}
