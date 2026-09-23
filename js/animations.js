/**
 * Core Animation Engine
 * Handles 3D Tilt, Fly-to-Cart Physics, Confetti Emitter, Ripple, and Counter Tickers.
 */

// 1. Confetti Particle System
class ConfettiEngine {
  constructor(canvasId = 'confetti-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.colors = ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#10b981', '#f59e0b', '#ffffff'];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire({ count = 80, originX = window.innerWidth / 2, originY = window.innerHeight / 2 } = {}) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 14;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 4,
        size: 6 + Math.random() * 8,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        decay: 0.015 + Math.random() * 0.015,
        gravity: 0.4
      });
    }

    if (!this.animationId) {
      this.animate();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

export const confetti = new ConfettiEngine();

// 2. 3D Tilt Engine for Cards
export function init3DTilt(element, options = {}) {
  const maxTilt = options.maxTilt || 14;
  const perspective = options.perspective || 1000;
  const scale = options.scale || 1.03;

  function handleMouseMove(e) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    element.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
    element.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
    element.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
  }

  function handleMouseLeave() {
    element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

// 3. Fly-to-Cart Physics Trajectory
export function animateFlyToCart(sourceImgElement, targetCartElement, onComplete) {
  if (!sourceImgElement || !targetCartElement) {
    if (onComplete) onComplete();
    return;
  }

  const startRect = sourceImgElement.getBoundingClientRect();
  const endRect = targetCartElement.getBoundingClientRect();

  // Create clone for animation
  const flyer = document.createElement('img');
  flyer.src = sourceImgElement.src;
  flyer.className = 'fly-to-cart-item';
  flyer.style.left = `${startRect.left + startRect.width / 2 - 24}px`;
  flyer.style.top = `${startRect.top + startRect.height / 2 - 24}px`;

  document.body.appendChild(flyer);

  // Force reflow
  flyer.getBoundingClientRect();

  const deltaX = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
  const deltaY = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);

  // Animate trajectory
  requestAnimationFrame(() => {
    flyer.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2) rotate(360deg)`;
    flyer.style.opacity = '0.7';
  });

  setTimeout(() => {
    flyer.remove();
    // Trigger cart pop
    targetCartElement.classList.remove('anim-badge-pop');
    void targetCartElement.offsetWidth; // trigger reflow
    targetCartElement.classList.add('anim-badge-pop');
    if (onComplete) onComplete();
  }, 750);
}

// 4. Click Ripple Generator
export function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('ripple-circle');

  const existing = button.getElementsByClassName('ripple-circle')[0];
  if (existing) {
    existing.remove();
  }

  button.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 600);
}
