window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hide');
        }
    }, 2000);
});

const canvas = document.getElementById('space-canvas');
if (canvas) {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        canvas.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
    });
}

const avatarImg = document.getElementById('avatar');
if (avatarImg && avatarImg.src.includes('placehold')) {
    const name = 'Ahmad Zaidan Qotrunnada';
    const initials = name.split(' ').map(n => n[0]).join('');
    avatarImg.src = `https://ui-avatars.com/api/?background=ff4d4d&color=fff&bold=true&size=150&name=${initials}`;
}

// console greeting
console.log('%c👾 zaidan · bug hunter | space mode active', 'color: #ff4d4d; font-size: 12px;');
