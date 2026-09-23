/**
 * Group Deals & Milestone Unlock Component
 * Unlocks higher discounts as more shoppers join, triggering liquid fills and confetti celebrations.
 */

import { confetti } from '../animations.js';
import { toast } from './toast.js';

export function initGroupDeals() {
  const joinBtn = document.getElementById('btn-join-deal');
  const progressBar = document.getElementById('group-progress-fill');
  const memberCountEl = document.getElementById('group-member-count');
  const avatarStack = document.querySelector('.avatar-stack');
  const tierNodes = document.querySelectorAll('.tier-node');

  let currentMembers = 12;
  const maxMembers = 30;

  const tiers = [
    { count: 5, discount: '10%' },
    { count: 15, discount: '25%' },
    { count: 30, discount: '50%' }
  ];

  function updateProgress() {
    const percentage = Math.min(100, (currentMembers / maxMembers) * 100);
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (memberCountEl) memberCountEl.textContent = `${currentMembers} / ${maxMembers} Joined`;

    // Check tier states
    tierNodes.forEach((node, idx) => {
      const tierReq = tiers[idx].count;
      if (currentMembers >= tierReq) {
        if (!node.classList.contains('unlocked')) {
          node.classList.add('unlocked');
          node.classList.remove('current');
        }
      } else if (idx === 0 || currentMembers >= tiers[idx - 1].count) {
        node.classList.add('current');
      }
    });
  }

  if (joinBtn) {
    joinBtn.addEventListener('click', (e) => {
      if (currentMembers >= maxMembers) {
        toast.show({
          icon: '🎉',
          title: 'Maximum Discount Unlocked!',
          message: 'The 50% group deal is maxed out! Everyone gets the VIP deal.',
          type: 'success'
        });
        return;
      }

      currentMembers += 1;
      updateProgress();

      // Check if unlocked a milestone
      const reachedTier = tiers.find(t => t.count === currentMembers);
      if (reachedTier) {
        const rect = joinBtn.getBoundingClientRect();
        confetti.fire({
          count: 100,
          originX: rect.left + rect.width / 2,
          originY: rect.top
        });

        toast.show({
          icon: '🎁',
          title: `Milestone Unlocked: ${reachedTier.discount} OFF!`,
          message: `Awesome! You helped hit the ${reachedTier.count} shopper goal!`,
          type: 'success'
        });
      } else {
        toast.show({
          icon: '🙌',
          title: 'Joined Group Deal!',
          message: `You joined the pool! Need ${getNextGoal(currentMembers)} more to unlock next tier.`,
          type: 'default'
        });
      }

      // Add user avatar to stack
      if (avatarStack) {
        const newAvatar = document.createElement('img');
        const randomId = Math.floor(Math.random() * 70) + 1;
        newAvatar.src = `https://i.pravatar.cc/100?img=${randomId}`;
        newAvatar.alt = 'New Buyer';
        newAvatar.className = 'anim-pop-in';
        avatarStack.insertBefore(newAvatar, avatarStack.firstChild);
      }
    });
  }

  function getNextGoal(current) {
    for (let t of tiers) {
      if (current < t.count) return t.count - current;
    }
    return 0;
  }

  updateProgress();
}
