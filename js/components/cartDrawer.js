/**
 * Cart Drawer Component
 * Handles the slide-in glass drawer, dynamic item addition, removal animations, and checkout celebration.
 */

import { confetti } from '../animations.js';
import { updateHeaderCartBadge } from './header.js';
import { toast } from './toast.js';

let cartItems = [];

export function initCartDrawer() {
  const cartBtn = document.getElementById('cart-btn');
  const drawerBackdrop = document.getElementById('cart-drawer-backdrop');
  const closeBtn = document.getElementById('cart-close-btn');
  const checkoutBtn = document.getElementById('btn-checkout');

  if (cartBtn && drawerBackdrop) {
    cartBtn.addEventListener('click', () => {
      drawerBackdrop.classList.add('open');
    });
  }

  if (closeBtn && drawerBackdrop) {
    closeBtn.addEventListener('click', () => {
      drawerBackdrop.classList.remove('open');
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) {
        drawerBackdrop.classList.remove('open');
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      if (cartItems.length === 0) {
        toast.show({
          icon: 'ℹ️',
          title: 'Your cart is empty',
          message: 'Add some futuristic items first to experience the animations!',
          type: 'warning'
        });
        return;
      }

      const rect = checkoutBtn.getBoundingClientRect();
      confetti.fire({
        count: 140,
        originX: rect.left + rect.width / 2,
        originY: rect.top
      });

      toast.show({
        icon: '🚀',
        title: 'Order Completed with Style!',
        message: 'Thank you for testing the e-commerce animation showcase!',
        type: 'success'
      });

      cartItems = [];
      renderCartItems();
      updateHeaderCartBadge(0);
      drawerBackdrop.classList.remove('open');
    });
  }
}

export function addItemToCart(product) {
  if (!product) return;
  cartItems.push({ ...product, cartItemId: Date.now() + Math.random() });
  renderCartItems();
  updateHeaderCartBadge(cartItems.length);
}

function renderCartItems() {
  const listEl = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal');
  if (!listEl) return;

  if (cartItems.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.75rem; opacity: 0.5;">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Your cart is empty</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    return;
  }

  let total = 0;
  listEl.innerHTML = cartItems.map(item => {
    total += item.price;
    return `
      <div class="cart-item" id="item-${item.cartItemId}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        </div>
        <button class="cart-item-remove" data-remove-id="${item.cartItemId}" title="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;

  // Bind remove item events
  listEl.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const removeId = parseFloat(btn.dataset.removeId);
      const itemEl = document.getElementById(`item-${removeId}`);
      if (itemEl) {
        itemEl.style.transition = 'all 0.3s ease';
        itemEl.style.opacity = '0';
        itemEl.style.transform = 'translateX(50px) scale(0.9)';
        setTimeout(() => {
          cartItems = cartItems.filter(i => i.cartItemId !== removeId);
          renderCartItems();
          updateHeaderCartBadge(cartItems.length);
        }, 300);
      }
    });
  });
}
