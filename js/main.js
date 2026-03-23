// loader (opsional, bisa dihapus)
window.addEventListener('load', () => {
    console.log('🚀 portfolio loaded');
});

// hamburger menu
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// section navigation
const navItems = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

function setActiveSection(targetId) {
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === targetId) {
            section.classList.add('active');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${targetId}`) {
            item.classList.add('active');
        }
    });
    
    if (navLinks) navLinks.classList.remove('active');
}

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('href').substring(1);
        setActiveSection(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active')) {
        if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    }
});

console.log('✅ developer portfolio ready');
