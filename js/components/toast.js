/**
 * Toast Notification System
 * Renders animated micro-notifications for purchase simulations and user actions.
 */

class ToastManager {
  constructor() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show({ title, message, icon = '✨', type = 'default', duration = 3500 }) {
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-text">
        ${title ? `<strong>${title}</strong>` : ''}
        <span>${message}</span>
      </div>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px) scale(0.9)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

export const toast = new ToastManager();
