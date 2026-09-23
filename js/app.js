/**
 * Main Application Bootstrap & Playground Controller
 */

import { confetti } from './animations.js';
import { initHeader } from './components/header.js';
import { initFlashSales } from './components/flashSales.js';
import { initGroupDeals } from './components/groupDeals.js';
import { renderProductGrid } from './components/productCard.js';
import { initCartDrawer } from './components/cartDrawer.js';
import { initCodeInspector, openCodeInspector } from './components/codeInspector.js';
import { toast } from './components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initHeader();
  initFlashSales();
  initGroupDeals();
  renderProductGrid();
  initCartDrawer();
  initCodeInspector();

  // Wire Playground Controls
  initPlaygroundControls();
});

function initPlaygroundControls() {
  // 1. Animation Speed Multiplier
  const speedBtns = document.querySelectorAll('.speed-select-btn');
  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      speedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const speed = btn.dataset.speed;
      document.documentElement.style.setProperty('--speed-multiplier', speed);
      
      toast.show({
        icon: '⚡',
        title: `Animation Speed: ${btn.textContent}`,
        message: speed === '0.25' ? 'Running in Slow Motion to inspect micro-details!' : `Global animation multiplier set to ${speed}x.`,
        type: 'default'
      });
    });
  });

  // 2. Reduced Motion Simulator
  const motionToggleBtn = document.getElementById('btn-toggle-reduced-motion');
  let isReducedMotion = false;
  if (motionToggleBtn) {
    motionToggleBtn.addEventListener('click', () => {
      isReducedMotion = !isReducedMotion;
      if (isReducedMotion) {
        document.body.classList.add('motion-reduced');
        motionToggleBtn.classList.add('primary');
        toast.show({
          icon: '♿',
          title: 'Reduced Motion Active',
          message: 'All transitions and keyframe animations disabled for accessibility.',
          type: 'warning'
        });
      } else {
        document.body.classList.remove('motion-reduced');
        motionToggleBtn.classList.remove('primary');
        toast.show({
          icon: '✨',
          title: 'Full Animations Restored',
          message: 'Smooth 60fps animations enabled.',
          type: 'success'
        });
      }
    });
  }

  // 3. Confetti Trigger Button
  const confettiBtn = document.getElementById('btn-trigger-confetti');
  if (confettiBtn) {
    confettiBtn.addEventListener('click', (e) => {
      const rect = confettiBtn.getBoundingClientRect();
      confetti.fire({
        count: 120,
        originX: rect.left + rect.width / 2,
        originY: rect.top
      });
    });
  }

  // 4. Skeleton Loading Toggle
  const skeletonBtn = document.getElementById('btn-toggle-skeleton');
  let isSkeleton = false;
  if (skeletonBtn) {
    skeletonBtn.addEventListener('click', () => {
      isSkeleton = !isSkeleton;
      const cards = document.querySelectorAll('.product-card, .flash-sales-card, .group-deal-card');
      cards.forEach(card => {
        if (isSkeleton) {
          card.classList.add('skeleton-loading');
        } else {
          card.classList.remove('skeleton-loading');
        }
      });

      if (isSkeleton) {
        skeletonBtn.classList.add('primary');
        toast.show({
          icon: '⏳',
          title: 'Skeleton Loading Preview',
          message: 'Displaying wave shimmer placeholder effect.',
          type: 'default'
        });
      } else {
        skeletonBtn.classList.remove('primary');
      }
    });
  }

  // 5. Section Inspect Buttons
  document.querySelectorAll('[data-inspect-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.inspectSection;
      openCodeInspector(section);
    });
  });
}
