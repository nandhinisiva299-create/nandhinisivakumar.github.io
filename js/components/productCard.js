/**
 * Product Card Component
 * Renders 3D tilt-interactive product cards with wishlist heart bursts and fly-to-cart animations.
 */

import { init3DTilt, animateFlyToCart, createRipple } from '../animations.js';
import { updateHeaderCartBadge } from './header.js';
import { addItemToCart } from './cartDrawer.js';
import { openCodeInspector } from './codeInspector.js';
import { toast } from './toast.js';

export const products = [
  {
    id: 'prod-1',
    name: 'AeroPulse Wireless Earbuds',
    category: 'Audio Pro',
    price: 189.99,
    oldPrice: 249.99,
    discount: '-25%',
    rating: '4.9 (1,240)',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
    description: 'Ultra-low latency ANC wireless earbuds with spatial audio tracking.'
  },
  {
    id: 'prod-2',
    name: 'CyberBlade Pro Smartwatch',
    category: 'Wearables',
    price: 329.00,
    oldPrice: 399.00,
    discount: '-18%',
    rating: '4.8 (890)',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    description: 'Titanium chassis with holographic AMOLED always-on display.'
  },
  {
    id: 'prod-3',
    name: 'Horizon XR Vision Goggles',
    category: 'Spatial Computing',
    price: 699.00,
    oldPrice: 899.00,
    discount: '-22%',
    rating: '5.0 (340)',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&auto=format&fit=crop&q=80',
    description: 'Next-gen mixed reality headset with eye and hand gesture tracking.'
  },
  {
    id: 'prod-4',
    name: 'Apex Mechanical RGB Keypad',
    category: 'Peripherals',
    price: 145.00,
    oldPrice: 199.00,
    discount: '-30%',
    rating: '4.7 (2,100)',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    description: 'Hot-swappable tactile mechanical switches with per-key RGB glow.'
  }
];

export function renderProductGrid() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = products.map(prod => `
    <div class="tilt-card-wrapper" data-id="${prod.id}">
      <article class="product-card" id="card-${prod.id}">
        <div class="card-glare"></div>

        <div class="card-top-badges">
          <span class="discount-badge anim-shimmer">${prod.discount}</span>
          <button class="wishlist-btn" title="Save to wishlist" aria-label="Add to wishlist" data-wishlist-id="${prod.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <div class="card-image-wrap">
          <img src="${prod.image}" alt="${prod.name}" class="card-image" id="img-${prod.id}" loading="lazy" />
        </div>

        <div class="card-category">${prod.category}</div>
        <h3 class="card-title" title="${prod.name}">${prod.name}</h3>

        <div class="card-rating">
          <span>★ ★ ★ ★ ★</span>
          <span>${prod.rating}</span>
        </div>

        <div class="card-price-row">
          <span class="card-price-current">$${prod.price.toFixed(2)}</span>
          <span class="card-price-old">$${prod.oldPrice.toFixed(2)}</span>
        </div>

        <div class="card-actions">
          <button class="btn-add-cart" data-cart-id="${prod.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Add to Cart</span>
          </button>
          <button class="btn-inspect-mini" data-inspect-key="product-card" title="Inspect 3D Card CSS">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </button>
        </div>
      </article>
    </div>
  `).join('');

  // Attach 3D tilt and actions
  document.querySelectorAll('.product-card').forEach(card => {
    init3DTilt(card);
  });

  // Wishlist clicks
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.classList.remove('anim-heart-burst');
        void svg.offsetWidth;
        svg.classList.add('anim-heart-burst');
      }
      if (btn.classList.contains('active')) {
        toast.show({
          icon: '💖',
          title: 'Saved to Wishlist!',
          message: 'Product added to your saved favorites.',
          type: 'default'
        });
      }
    });
  });

  // Add to cart with fly trajectory
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      createRipple(e);
      const prodId = btn.dataset.cartId;
      const product = products.find(p => p.id === prodId);
      const imgEl = document.getElementById(`img-${prodId}`);
      const cartIcon = document.getElementById('cart-btn');

      animateFlyToCart(imgEl, cartIcon, () => {
        addItemToCart(product);
        toast.show({
          icon: '🛒',
          title: 'Added to Cart!',
          message: `${product.name} is now in your shopping bag.`,
          type: 'success'
        });
      });
    });
  });

  // Inspect buttons
  document.querySelectorAll('.btn-inspect-mini').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCodeInspector('productCard');
    });
  });
}
