/**
 * Flash Sales Urgency Component
 * Handles the live countdown timer, stock progress shimmer, and simulated sales bursts.
 */

import { toast } from './toast.js';

export function initFlashSales() {
  const hoursEl = document.getElementById('flash-hours');
  const minsEl = document.getElementById('flash-mins');
  const secsEl = document.getElementById('flash-secs');
  const stockBar = document.getElementById('flash-stock-bar');
  const stockCount = document.getElementById('flash-stock-count');

  // Set 4 hours 45 minutes countdown from now
  let totalSeconds = 4 * 3600 + 45 * 60 + 30;

  function updateTimer() {
    if (totalSeconds <= 0) {
      totalSeconds = 6 * 3600; // Reset loop
    }

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');

    if (hoursEl && hoursEl.textContent !== hStr) {
      hoursEl.textContent = hStr;
      animateDigit(hoursEl);
    }
    if (minsEl && minsEl.textContent !== mStr) {
      minsEl.textContent = mStr;
      animateDigit(minsEl);
    }
    if (secsEl && secsEl.textContent !== sStr) {
      secsEl.textContent = sStr;
      animateDigit(secsEl);
    }

    totalSeconds--;
  }

  function animateDigit(el) {
    el.classList.remove('anim-digit-change');
    void el.offsetWidth;
    el.classList.add('anim-digit-change');
  }

  setInterval(updateTimer, 1000);
  updateTimer();

  // Simulated Live Buyers
  const buyers = [
    { name: 'Sarah K.', city: 'New York', item: 'Cyber Horizon AR Headset' },
    { name: 'Liam P.', city: 'London', item: 'Sonic Pulse Pro' },
    { name: 'Elena R.', city: 'Tokyo', item: 'Titan Mechanical Keypad' },
    { name: 'Marcus D.', city: 'Berlin', item: 'Aura Stealth Drone' }
  ];

  let buyerIdx = 0;
  let remainingStock = 18;

  setInterval(() => {
    const buyer = buyers[buyerIdx % buyers.length];
    buyerIdx++;

    if (remainingStock > 3) {
      remainingStock--;
      if (stockCount) stockCount.textContent = `${remainingStock} left`;
      if (stockBar) {
        const percentage = (remainingStock / 25) * 100;
        stockBar.style.width = `${percentage}%`;
      }
    }

    toast.show({
      icon: '🔥',
      title: 'Flash Sale Claimed!',
      message: `${buyer.name} from ${buyer.city} just secured ${buyer.item}!`,
      type: 'warning'
    });
  }, 14000);
}
