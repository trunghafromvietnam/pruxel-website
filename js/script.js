document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const menuBtn   = document.getElementById('mobile-menu-btn');
    const closeBtn  = document.getElementById('mobile-nav-close-btn');
    const mobileNav = document.getElementById('mobile-nav-drawer');
    const backdrop  = document.getElementById('mobile-nav-backdrop');
    const navLinks  = mobileNav ? mobileNav.querySelectorAll('a') : [];
  
    const lock   = () => document.body.classList.add('body-lock');
    const unlock = () => document.body.classList.remove('body-lock');
  
    const openMenu = () => {
      mobileNav.classList.add('is-open');
      menuBtn.setAttribute('aria-expanded', 'true');
      backdrop?.removeAttribute('hidden');
      lock();
    };
  
    const closeMenu = () => {
      mobileNav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      backdrop?.setAttribute('hidden', '');
      unlock();
    };
  
    // Event bindings
    menuBtn?.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);
    backdrop?.addEventListener('click', closeMenu);
  
    // Đóng menu khi click link bên trong
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
  
    // Đóng khi nhấn Esc
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeMenu();
      }
    });
  
    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('main section[id]');
    const mainNavLinks = document.querySelectorAll('.main-nav .nav-links a');
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          mainNavLinks.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(`.main-nav .nav-links a[href="#${id}"]`);
          activeLink?.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
  
    sections.forEach(section => observer.observe(section));
  });
  