document.addEventListener("DOMContentLoaded", () => {
  const targetDate = new Date("2026-03-23T16:00:00"); // Target date
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  function normalizeDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  let interval;

  function updateCountdown() {
    const now = new Date();
    let remainingSeconds = Math.floor((targetDate - now) / 1000);

    const countdownEl = document.getElementById("countdown");
    const image1 = document.getElementById("image1");
    const image2 = document.getElementById("image2");
    const messageEl = document.getElementById("message");

    if (!countdownEl || !image1 || !image2) return;

    if (remainingSeconds <= 0) {
      countdownEl.innerText = "¡Por fin amor! ❤️";
      if (messageEl) messageEl.style.display = "block";
      clearInterval(interval);
      return;
    }

    const days = Math.floor(remainingSeconds / (3600 * 24));
    const hours = Math.floor((remainingSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    countdownEl.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const totalSeconds = Math.floor((targetDate - startDate) / 1000);
    const progress = 1 - remainingSeconds / totalSeconds;

    const startLeft = 10;
    const endLeft = 50;

    image1.style.left = `${startLeft + (endLeft - startLeft) * progress}%`;
    image2.style.right = `${startLeft + (endLeft - startLeft) * progress}%`;

    const startSize = 100;
    const endSize = 200;
    const currentSize = startSize + (endSize - startSize) * progress;

    image1.style.width = `${currentSize}px`;
    image2.style.width = `${currentSize}px`;

    const line = document.getElementById("love-line");
    if (line) {
      const rect1 = image1.getBoundingClientRect();
      const rect2 = image2.getBoundingClientRect();
      const containerRect = image1.parentElement.getBoundingClientRect();

      const x1 = rect1.right - containerRect.left;
      const x2 = rect2.left - containerRect.left;

      line.style.left = `${x1}px`;
      line.style.width = `${x2 - x1}px`;
    }
  }

  function generateCalendar() {
    const calendarEl = document.getElementById("calendar");
    const months = [];
    let current = new Date(startDate);

    while (current <= targetDate) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const monthName =
        current.toLocaleString("default", { month: "long" }) + " " + year;

      if (!months.some((m) => m.year === year && m.month === month)) {
        months.push({ year, month, name: monthName });
      }

      current.setMonth(current.getMonth() + 1);
    }

    let markedDays = JSON.parse(localStorage.getItem("markedDays") || "[]");
    const today = normalizeDate(new Date());

    months.forEach(({ year, month, name }) => {
      const monthEl = document.createElement("div");
      monthEl.className = "month";

      const title = document.createElement("h3");
      title.textContent = name;
      monthEl.appendChild(title);

      const weekdays = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
      const weekdaysEl = document.createElement("div");
      weekdaysEl.className = "weekdays";
      weekdays.forEach((day) => {
        const dayEl = document.createElement("div");
        dayEl.textContent = day;
        weekdaysEl.appendChild(dayEl);
      });
      monthEl.appendChild(weekdaysEl);

      const daysEl = document.createElement("div");
      daysEl.className = "days";

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDayOfWeek = firstDay.getDay();

      let maxDay = lastDay.getDate();
      if (
        year === targetDate.getFullYear() &&
        month === targetDate.getMonth()
      ) {
        maxDay = targetDate.getDate();
      }

      for (let i = 0; i < startDayOfWeek; i++) {
        const emptyEl = document.createElement("div");
        emptyEl.className = "day empty";
        daysEl.appendChild(emptyEl);
      }

      for (let day = 1; day <= maxDay; day++) {
        const dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.textContent = day;

        const currentDay = normalizeDate(new Date(year, month, day));
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;

        // Marcar automáticamente días pasados
        if (currentDay < today) {
          dayEl.classList.add("passed");
          if (!markedDays.includes(dateStr)) {
            markedDays.push(dateStr);
          }
        }

        if (markedDays.includes(dateStr)) {
          dayEl.classList.add("passed");
        }

        if (currentDay.getTime() === normalizeDate(targetDate).getTime()) {
          dayEl.classList.add("target");
        }

        if (currentDay >= today && currentDay <= normalizeDate(targetDate)) {
          dayEl.addEventListener("click", () => {
            dayEl.classList.toggle("passed");
            if (dayEl.classList.contains("passed")) {
              if (!markedDays.includes(dateStr)) {
                markedDays.push(dateStr);
              }
            } else {
              markedDays = markedDays.filter((d) => d !== dateStr);
            }
            localStorage.setItem("markedDays", JSON.stringify(markedDays));
          });
        }

        daysEl.appendChild(dayEl);
      }

      monthEl.appendChild(daysEl);
      calendarEl.appendChild(monthEl);
    });

    localStorage.setItem("markedDays", JSON.stringify(markedDays));
  }

  updateCountdown();
  generateCalendar();
  interval = setInterval(updateCountdown, 1000);
});
