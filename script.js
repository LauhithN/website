// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    const navHeight = 20; // Offset for padding
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navHeight;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Handle navigation active states
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.main-nav a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add click event listeners to nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        scrollToSection(targetId);
    });
});

// Fade in elements on scroll
const fadeInElements = document.querySelectorAll('.project-card, .content-box');
const fadeInOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInOnScroll = new IntersectionObserver((entries, fadeInOnScroll) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('fade-in');
        fadeInOnScroll.unobserve(entry.target);
    });
}, fadeInOptions);

fadeInElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    fadeInOnScroll.observe(element);
});

// Add fade-in class for animation
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    fadeInElements.forEach(element => {
        setTimeout(() => {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        }, 300);
    });
}); 