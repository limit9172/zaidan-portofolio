window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hide');
    }, 2000);
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

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


const scrollHint = document.getElementById('scrollHint');
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollHint) {
        scrollHint.classList.add('hide');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            scrollHint.classList.remove('hide');
        }, 2000);
    }
});

console.log('%c👾 zaidan · bug hunter | solar system mode active', 'color: #ff4d4d; font-size: 12px;');
