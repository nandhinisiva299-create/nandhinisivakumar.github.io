/**
 * Code Inspector Modal
 * Displays and allows easy one-click copying of production-ready CSS keyframes and JS code snippets.
 */

import { toast } from './toast.js';

const codeSnippets = {
  flashSales: {
    title: 'Flash Sales Urgency Effects',
    css: `/* Urgent Flame Glow Animation */
@keyframes flameFlicker {
  0%, 100% {
    transform: scale(1) rotate(-1deg);
    filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.8));
  }
  25% {
    transform: scale(1.08) rotate(2deg);
    filter: drop-shadow(0 0 14px rgba(239, 68, 68, 0.9));
  }
  50% {
    transform: scale(0.95) rotate(-2deg);
    filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.85));
  }
  75% {
    transform: scale(1.05) rotate(1deg);
    filter: drop-shadow(0 0 16px rgba(249, 115, 22, 1));
  }
}

/* Shimmer Progress Fill for Stock Level */
@keyframes shimmerWave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.stock-bar-fill::after {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmerWave 2s infinite ease-in-out;
}`,
    js: `// Countdown Digit Flip Animation
function animateDigit(element) {
  element.classList.remove('anim-digit-change');
  void element.offsetWidth; // Force DOM reflow
  element.classList.add('anim-digit-change');
}`
  },

  groupDeals: {
    title: 'Group Deals Milestone & Fluid Fill',
    css: `/* Fluid Multi-Color Progress Wave */
@keyframes fluidWaveMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.group-tier-bar-active {
  background: linear-gradient(90deg, #8b5cf6, #ec4899, #f97316, #06b6d4, #8b5cf6);
  background-size: 300% 100%;
  animation: fluidWaveMove 4s ease infinite;
  transition: width 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Milestone Radar Ping */
@keyframes radarPing {
  0% { transform: scale(0.95); opacity: 0.9; }
  50% { transform: scale(1.6); opacity: 0; }
  100% { transform: scale(0.95); opacity: 0; }
}`,
    js: `// Milestone Unlock Confetti Trigger
function checkMilestoneUnlock(currentMembers, targetGoal) {
  if (currentMembers >= targetGoal) {
    confetti.fire({ count: 100 });
  }
}`
  },

  productCard: {
    title: '3D Perspective Tilt Card & Glare',
    css: `/* 3D Tilt Card Base & Glare */
.product-card {
  transform-style: preserve-3d;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.card-glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 255, 255, 0.15) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .card-glare {
  opacity: 1;
}`,
    js: `// Mouse-tracking 3D Tilt Engine
export function init3DTilt(element, maxTilt = 14) {
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -maxTilt;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * maxTilt;

    element.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.03, 1.03, 1.03)\`;
    element.style.setProperty('--mouse-x', \`\${(x / rect.width) * 100}%\`);
    element.style.setProperty('--mouse-y', \`\${(y / rect.height) * 100}%\`);
  });

  element.addEventListener('mouseleave', () => {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}`
  },

  flyToCart: {
    title: 'Fly-to-Cart Physics Trajectory',
    css: `/* Floating Clone Item */
.fly-to-cart-item {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
  transition: all 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Badge Bounce Pop */
@keyframes badgePop {
  0% { transform: scale(0.4); opacity: 0; }
  60% { transform: scale(1.35); }
  100% { transform: scale(1); opacity: 1; }
}`,
    js: `// Dynamic Trajectory Coordinates
export function animateFlyToCart(sourceImg, targetCart, onComplete) {
  const start = sourceImg.getBoundingClientRect();
  const end = targetCart.getBoundingClientRect();

  const flyer = document.createElement('img');
  flyer.src = sourceImg.src;
  flyer.className = 'fly-to-cart-item';
  flyer.style.left = \`\${start.left + start.width/2 - 24}px\`;
  flyer.style.top = \`\${start.top + start.height/2 - 24}px\`;
  document.body.appendChild(flyer);

  const deltaX = end.left + end.width/2 - (start.left + start.width/2);
  const deltaY = end.top + end.height/2 - (start.top + start.height/2);

  requestAnimationFrame(() => {
    flyer.style.transform = \`translate(\${deltaX}px, \${deltaY}px) scale(0.2) rotate(360deg)\`;
    flyer.style.opacity = '0.7';
  });

  setTimeout(() => {
    flyer.remove();
    if (onComplete) onComplete();
  }, 750);
}`
  }
};

let currentTab = 'css';
let currentKey = 'flashSales';

export function initCodeInspector() {
  const modalBackdrop = document.getElementById('code-modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');
  const tabCss = document.getElementById('tab-css');
  const tabJs = document.getElementById('tab-js');
  const copyBtn = document.getElementById('btn-copy-code');

  if (closeBtn && modalBackdrop) {
    closeBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
      }
    });
  }

  if (tabCss && tabJs) {
    tabCss.addEventListener('click', () => {
      currentTab = 'css';
      tabCss.classList.add('active');
      tabJs.classList.remove('active');
      updateCodeView();
    });

    tabJs.addEventListener('click', () => {
      currentTab = 'js';
      tabJs.classList.add('active');
      tabCss.classList.remove('active');
      updateCodeView();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = getActiveCode();
      navigator.clipboard.writeText(code).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>✓ Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);

        toast.show({
          icon: '📋',
          title: 'Code Copied!',
          message: 'Snippet copied to clipboard ready to paste into your project.',
          type: 'success'
        });
      });
    });
  }
}

export function openCodeInspector(key = 'flashSales') {
  currentKey = codeSnippets[key] ? key : 'flashSales';
  const modalBackdrop = document.getElementById('code-modal-backdrop');
  const modalTitle = document.getElementById('modal-title-text');
  
  if (modalTitle) {
    modalTitle.textContent = codeSnippets[currentKey].title;
  }

  updateCodeView();

  if (modalBackdrop) {
    modalBackdrop.classList.add('open');
  }
}

function updateCodeView() {
  const codeBlock = document.getElementById('code-content');
  if (codeBlock) {
    codeBlock.textContent = getActiveCode();
  }
}

function getActiveCode() {
  const snippet = codeSnippets[currentKey] || codeSnippets.flashSales;
  return currentTab === 'css' ? snippet.css : snippet.js;
}
