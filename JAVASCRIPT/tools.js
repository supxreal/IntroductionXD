(() => {
  const slider = document.querySelector('.cslider');
  if (!slider) return;

  const track = slider.querySelector('.cslider-track');
  const cards = Array.from(track.querySelectorAll('.c-card'));
  const prevBtn = slider.querySelector('.c-btn.prev');
  const nextBtn = slider.querySelector('.c-btn.next');
  const dotsWrap = slider.querySelector('.c-dots');

  // คำนวณความกว้าง 1 สไลด์ (รวม gap)
  const slideSize = () => track.getBoundingClientRect().width - 64;

  // คำนวน index ปัจจุบันจาก scrollLeft
  const currentIndex = () => {
    const cardWidth = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
    return Math.round(track.scrollLeft / cardWidth);
  };

  // สร้าง dots
  const makeDots = () => {
    dotsWrap.innerHTML = '';
    const visibleCount = getVisibleCount();
    const pageCount = Math.max(1, Math.ceil(cards.length / visibleCount));

    for (let i = 0; i < pageCount; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `ไปหน้าที่ ${i + 1}`);
      btn.addEventListener('click', () => goToPage(i));
      dotsWrap.appendChild(btn);
    }
    updateDots();
  };

  // นับจำนวนการ์ดที่เห็นพร้อมกัน (ตาม CSS media)
  const getVisibleCount = () => {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  };

  // ไปหน้าที่ n (pagination แบบเป็นหน้า)
  const goToPage = (page) => {
    const visible = getVisibleCount();
    const targetIndex = page * visible;
    const targetCard = cards[Math.min(targetIndex, cards.length - 1)];
    if (!targetCard) return;
    targetCard.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    setTimeout(updateDots, 240);
  };

  // ปุ่มเลื่อนทีละ “หน้า”
  const nudge = (dir) => {
    const visible = getVisibleCount();
    const idx = currentIndex();
    const nextIdx = Math.max(0, Math.min(cards.length - 1, idx + dir * visible));
    const targetCard = cards[nextIdx];
    if (!targetCard) return;
    targetCard.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    setTimeout(updateDots, 240);
  };

  // อัปเดตสถานะ dots
  const updateDots = () => {
    const visible = getVisibleCount();
    const idx = currentIndex();
    const activePage = Math.floor(idx / visible);
    dotsWrap.querySelectorAll('[role="tab"]').forEach((b, i) => {
      b.setAttribute('aria-selected', i === activePage ? 'true' : 'false');
    });
  };

  // Events
  prevBtn.addEventListener('click', () => nudge(-1));
  nextBtn.addEventListener('click', () => nudge(1));
  track.addEventListener('scroll', () => {
    // throttle แบบง่าย
    window.clearTimeout(track._t);
    track._t = setTimeout(updateDots, 80);
  });
  window.addEventListener('resize', () => {
    makeDots();
    updateDots();
  });

  // Keyboard accessibility (ซ้าย/ขวา)
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); nudge(1); }
  });

  // init
  makeDots();
  updateDots();
})();
