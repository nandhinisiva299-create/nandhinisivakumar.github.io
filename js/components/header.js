/**
 * Header Component & Navigation Effects
 * Manages sticky glass blur, theme toggling, notification bell shake, and cart badge pulses.
 */

export function initHeader() {
  const header = document.querySelector('.site-header');
  const themeBtns = document.querySelectorAll('.theme-btn');
  const notifBtn = document.querySelector('#notif-btn');
  const cartBtn = document.querySelector('#cart-btn');

  // Sticky Glass blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Theme Switching
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.dataset.theme;
      if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
    });
  });

  // Bell Shake on click
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      const bellIcon = notifBtn.querySelector('.bell-icon');
      if (bellIcon) {
        bellIcon.classList.remove('anim-bell-shake');
        void bellIcon.offsetWidth; // Reflow
        bellIcon.classList.add('anim-bell-shake');
      }
    });
  }
}

export function updateHeaderCartBadge(count) {
  const badge = document.querySelector('#cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.classList.remove('anim-badge-pop');
    void badge.offsetWidth;
    badge.classList.add('anim-badge-pop');
  }
}
