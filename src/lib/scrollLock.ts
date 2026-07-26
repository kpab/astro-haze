// Shared body-scroll lock for the mobile nav and the search modal. Both can
// be open at once (search is reachable while the nav is expanded), so a
// naive `style.overflow = 'hidden' / ''` from either one clobbers the
// other's lock when it closes first. Track how many callers currently want
// the lock and only clear it once none remain.
let lockCount = 0;

export function lockScroll(): void {
  lockCount++;
  document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.style.overflow = '';
  }
}
