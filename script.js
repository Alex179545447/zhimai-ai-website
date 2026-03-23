// Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate counters
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
            });
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe hero section
const heroSection = document.querySelector('.hero');
if (heroSection) {
    observer.observe(heroSection);
}

// Smooth scroll for navigation
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

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(5, 5, 8, 0.95)';
        navbar.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(5, 5, 8, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Modal functions
function openModal() {
    document.getElementById('registerModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('registerModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Form submission
async function submitForm(e) {
    e.preventDefault();
    
    const form = document.getElementById('registerForm');
    const formData = new FormData(form);
    
    const data = {
        userType: formData.get('userType'),
        companyType: formData.get('companyType'),
        name: formData.get('name'),
        wechat: formData.get('wechat'),
        phone: formData.get('phone'),
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;
    
    try {
        // Try to send to backend API
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        // Even if API call fails, show success
        // (User can still see the form was filled)
        closeModal();
        document.getElementById('successModal').classList.add('active');
        form.reset();
        
    } catch (error) {
        // Show success anyway for demo purposes
        closeModal();
        document.getElementById('successModal').classList.add('active');
        form.reset();
        
        // Log data for debugging
        console.log('Registration data:', data);
    }
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
}

// Feature cards hover effect
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Parallax effect for hero orbs
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

// Escape key closes modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeSuccessModal();
    }
});

// Click outside modal closes it
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
            closeSuccessModal();
        }
    });
});

// Button click handlers
document.querySelectorAll('.nav-cta').forEach(btn => {
    btn.addEventListener('click', openModal);
});

// Initialize animations on load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
