// Portfolio JavaScript

// Theme Toggle
let isDark = true;

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-btn');
    const icon = btn.querySelector('i');
    
    if (isDark) {
        body.classList.add('light-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        isDark = false;
    } else {
        body.classList.remove('light-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        isDark = true;
    }
}

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Typing effect for hero
const tagline = document.querySelector('.tagline');
if (tagline) {
    const originalText = tagline.textContent;
    tagline.textContent = '';

    let charIndex = 0;
    function typeWriter() {
        if (charIndex < originalText.length) {
            tagline.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    }

    window.addEventListener('load', () => {
        setTimeout(typeWriter, 500);
    });
}

// Console message
console.log('%c Hey there! 👋', 'color: #e94560; font-size: 20px; font-weight: bold;');
console.log('%c Built by @seesaw07', 'color: #a0a0a0; font-size: 14px;');