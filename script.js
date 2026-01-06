document.addEventListener("DOMContentLoaded", () => {
  const targetDate = new Date("2026-03-23T10:00:00"); // Target date
  const now = new Date();
  const totalSeconds = Math.floor((targetDate - now) / 1000);

  let remainingSeconds = totalSeconds;
  let interval;

  function updateCountdown() {
    const days = Math.floor(remainingSeconds / (3600 * 24));
    const hours = Math.floor((remainingSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    const countdownEl = document.getElementById("countdown");
    const image1 = document.getElementById("image1");
    const image2 = document.getElementById("image2");
    const messageEl = document.getElementById("message");

    if (!countdownEl || !image1 || !image2) return;

    countdownEl.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // Progress (0 → 1)
    const progress = 1 - remainingSeconds / totalSeconds;

    // Positions
    const startLeft = 10;
    const endLeft = 50;
    const startRight = 90;
    const endRight = 50;

    const currentLeft = startLeft + (endLeft - startLeft) * progress;
    const currentRight = startRight - (startRight - endRight) * progress;

    image1.style.left = `${currentLeft}%`;
    image2.style.right = `${100 - currentRight}%`;

    // Size animation
    const startSize = 100;
    const endSize = 200;
    const currentSize = startSize + (endSize - startSize) * progress;

    image1.style.width = `${currentSize}px`;
    image2.style.width = `${currentSize}px`;

    if (remainingSeconds <= 0) {
      countdownEl.innerText = "Por fin amor!";
      if (messageEl) messageEl.style.display = "block";
      clearInterval(interval);
    } else {
      remainingSeconds--;
    }
  }

  // Initial call
  updateCountdown();

  // Update every second
  interval = setInterval(updateCountdown, 1000);
});
