// --- LUCIDE ICONS ---
lucide.createIcons();

// --- HEADER SCROLL EFFECT ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// --- REVEAL ON SCROLL ---
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- WAVE CANVAS ENGINE ---
const canvas = document.getElementById('wave-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let time = 0;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

let animId;
let lastFrame = 0;
const FPS_CAP = 30; // cap at 30fps — smooth but light

function draw(timestamp) {
    animId = requestAnimationFrame(draw);

    // Throttle to 30fps
    if (timestamp - lastFrame < 1000 / FPS_CAP) return;
    lastFrame = timestamp;

    // Skip if tab not visible
    if (document.hidden) return;

    ctx.clearRect(0, 0, width, height);
    time += 0.008;

    // Reduced grid: 22x22 instead of 40x40 — 70% less work, same visual
    const rows = 22;
    const cols = 22;
    const spacing = width / 14;

    ctx.lineWidth = 1;

    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        const alpha = Math.max(0, 1 - (i / rows)) * 0.18;
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
        for (let j = 0; j <= cols; j++) {
            const x = (j - cols / 2) * spacing;
            const z = (i - rows / 2) * spacing;
            const dist = Math.sqrt(x * x + z * z) * 0.005;
            const y = Math.sin(dist - time * 2) * 35 + Math.cos(x * 0.002 + time) * 15;
            const scale = 1000 / (1000 + z);
            const px = width / 2 + x * scale;
            const py = height / 1.5 + (y + 180) * scale;
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    // Vertical lines
    for (let j = 0; j <= cols; j++) {
        ctx.beginPath();
        for (let i = 0; i <= rows; i++) {
            const x = (j - cols / 2) * spacing;
            const z = (i - rows / 2) * spacing;
            const dist = Math.sqrt(x * x + z * z) * 0.005;
            const y = Math.sin(dist - time * 2) * 35 + Math.cos(x * 0.002 + time) * 15;
            const scale = 1000 / (1000 + z);
            const px = width / 2 + x * scale;
            const py = height / 1.5 + (y + 180) * scale;
            const alpha = Math.max(0, 1 - (i / rows)) * 0.18;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }
}

draw();

// --- VERTICAL WAVE (SOLUTIONS) ---
const vCanvas = document.getElementById('vertical-wave-canvas');

if (vCanvas) {
    const vCtx = vCanvas.getContext('2d');
    let vw, vh, vt = 0;

    function resizeV() {
        vw = vCanvas.width = window.innerWidth;
        vh = vCanvas.height = window.innerHeight;
    }
    resizeV();
    window.addEventListener('resize', resizeV);

    let vLastFrame = 0;
    function drawV(timestamp) {
        requestAnimationFrame(drawV);
        if (timestamp - vLastFrame < 1000 / 30) return;
        if (document.hidden) return;
        vLastFrame = timestamp;

        vCtx.clearRect(0,0,vw,vh);
        vt += 0.004;

        const lines = 20; // reduced from 40

        for(let i=0;i<lines;i++){
            vCtx.beginPath();
            for(let x=0;x<vw;x+=30){ // step 30 instead of 20
                const y = Math.sin(x*0.01 + vt + i*0.3) * 40 + i*28;
                vCtx.lineTo(x,y);
            }
            vCtx.strokeStyle = `rgba(59,130,246,${0.06 + i/lines*0.15})`;
            vCtx.stroke();
        }
    }

    drawV();
}

const steps = document.querySelectorAll('.step-card');
const dot = document.querySelector('.process-dot');

window.addEventListener('scroll', () => {
    if (!dot || !steps.length) return;
    steps.forEach((step, i) => {
        const rect = step.getBoundingClientRect();
        if(rect.top < window.innerHeight/2 && rect.bottom > window.innerHeight/2){
            dot.style.top = `${i * 120}px`;
        }
    });
});

// --- SUBTLE MOUSE PARALLAX FOR HERO ---
let mouseThrottle;
document.addEventListener('mousemove', (e) => {
    if (mouseThrottle) return;
    mouseThrottle = requestAnimationFrame(() => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        const hero = document.querySelector('.hero-content');
        if (hero) hero.style.transform = `translate(${moveX}px, ${moveY}px)`;
        mouseThrottle = null;
    });
});

// 1. Hiệu ứng Typewriter & Checkmark cho Badge
function typeBadge(el) {
    const text = el.getAttribute('data-text');
    let i = 0;
    el.innerHTML = '';
    const typing = setInterval(() => {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
            const check = el.parentElement.querySelector('.check-icon');
            if (check) check.classList.add('show');
        }
    }, 50);
}

const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.target.classList.contains('step-card')) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        }

        // Kích hoạt Typewriter khi thấy badge
        if (entry.target.classList.contains('typewriter') && entry.isIntersecting) {
            typeBadge(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.step-card, #metrics-trigger, .typewriter').forEach(el => {
    processObserver.observe(el);
});


// Hamburger logics
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

  

// ===================================================
// PROJECTS TAB SWITCHING
// ===================================================
(function() {
    const navBtns = document.querySelectorAll('.projects-navigation-btns');
    const contents = document.querySelectorAll('.project-content');

    if (!navBtns.length) return;

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            // Update buttons
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content panels
            contents.forEach(c => c.classList.remove('active'));
            const activeContent = document.getElementById(target + '-content');
            if (activeContent) {
                activeContent.classList.add('active');
                // Animate counters for the newly active panel
                animateCounters(activeContent);
            }
        });
    });

    // Animate counters when projects section enters view
    const proofSection = document.getElementById('proof');
    if (proofSection) {
        const proofObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activePanel = proofSection.querySelector('.project-content.active');
                    if (activePanel) animateCounters(activePanel);
                    proofObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });
        proofObserver.observe(proofSection);
    }
})();

// ===================================================
// COUNTER ANIMATION
// ===================================================
function animateCounters(container) {
    const nums = container.querySelectorAll('.stat-num');
    nums.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 1200;
        const step = target / (duration / 16);

        el.textContent = '0';

        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = Math.round(current);
        }, 16);
    });
}

// ===================================================
// REAL CLOCK — sync hands to actual time
// ===================================================
(function() {
    function updateClock() {
        const now = new Date();
        const h = now.getHours() % 12;
        const m = now.getMinutes();
        const s = now.getSeconds();

        const hDeg = (h * 30) + (m * 0.5);
        const mDeg = m * 6;
        const sDeg = s * 6;

        const hourHand = document.getElementById('hour-hand');
        const minHand = document.getElementById('min-hand');
        const secHand = document.getElementById('sec-hand');

        if (hourHand) hourHand.style.transform = `rotate(${hDeg}deg)`;
        if (minHand) minHand.style.transform = `rotate(${mDeg}deg)`;
        if (secHand) secHand.style.transform = `rotate(${sDeg}deg)`;
    }

    // Remove CSS rotation animations — JS takes over
    setTimeout(() => {
        const hh = document.getElementById('hour-hand');
        const mh = document.getElementById('min-hand');
        const sh = document.getElementById('sec-hand');
        if (hh) hh.style.animation = 'none';
        if (mh) mh.style.animation = 'none';
        if (sh) sh.style.animation = 'none';
        updateClock();
    }, 0);

    setInterval(updateClock, 1000);
})();

// ===================================================
// BAR CHART — cycling height animation
// ===================================================
(function() {
    const bars = document.querySelectorAll('.chart-bar');
    if (!bars.length) return;

    const heights = [
        [45, 65, 55, 80, 70],
        [60, 40, 75, 55, 85],
        [70, 80, 45, 65, 50],
        [50, 70, 85, 40, 75],
    ];
    let cycle = 0;

    function cycleBars() {
        cycle = (cycle + 1) % heights.length;
        bars.forEach((bar, i) => {
            bar.style.transition = 'height 0.8s cubic-bezier(0.4,0,0.2,1)';
            bar.style.height = heights[cycle][i] + '%';

            // Move active class to tallest bar
            const maxH = Math.max(...heights[cycle]);
            bar.classList.toggle('active', heights[cycle][i] === maxH);
        });
    }

    setInterval(cycleBars, 2500);
})();

// Re-init lucide for dynamically added icons
lucide.createIcons();

// ===================================================
// CONTACT FORM — kết nối /api/contact
// ===================================================
(function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Validation helpers
    function setError(groupId, show) {
        const g = document.getElementById(groupId);
        if (!g) return;
        if (show) g.classList.add('error');
        else g.classList.remove('error');
    }

    function validateEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    // Clear error on typing
    document.getElementById('input-name')?.addEventListener('input', () => setError('fg-name', false));
    document.getElementById('input-email')?.addEventListener('input', () => setError('fg-email', false));

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name  = document.getElementById('input-name')?.value.trim();
        const email = document.getElementById('input-email')?.value.trim();
        const budget = document.getElementById('input-budget')?.value;
        const desc   = document.getElementById('input-desc')?.value.trim();
        const services = [...form.querySelectorAll('[name="services"]:checked')]
                           .map(cb => cb.value).join(', ');

        // Validate
        let ok = true;
        if (!name)               { setError('fg-name', true);  ok = false; }
        if (!validateEmail(email)) { setError('fg-email', true); ok = false; }
        if (!ok) return;

        // Loading state
        const btn      = document.getElementById('submit-btn');
        const btnText  = btn.querySelector('.btn-text');
        const btnSpin  = btn.querySelector('.btn-spinner');
        btnText.style.display = 'none';
        btnSpin.style.display = 'inline-flex';
        btn.disabled = true;

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, budget, services, description: desc }),
            });

            if (!res.ok) throw new Error(`Server error ${res.status}`);

            // Success
            form.querySelectorAll('.form-group').forEach(g => g.style.display = 'none');
            btn.style.display = 'none';
            form.querySelector('.form-success').style.display = 'flex';

        } catch (err) {
            console.error(err);
            btnText.textContent = 'Error — Try Again';
            btnText.style.display = 'inline';
            btnSpin.style.display = 'none';
            btn.disabled = false;
            btn.style.borderColor = '#ef4444';
        }
    });
})();
  