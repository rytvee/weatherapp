const form = document.getElementById("weatherForm"); 
const weatherDiv = document.getElementById("weather");
const dateInput = document.getElementById("dateInput");
const calendarIcon = document.getElementById("calendarIcon");

// Detect mobile
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Dynamic placeholder (MM/dd/YYYY)
function setDynamicPlaceholder() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  dateInput.setAttribute("placeholder", `${month}/dd/${year}`);
}
setDynamicPlaceholder();
setInterval(setDynamicPlaceholder, 60000); // update if month changes

// Min/max date
const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 2);

if (isMobile()) {
  // Mobile → use Flatpickr
  dateInput.setAttribute("type", "text"); // no native arrow
  const fp = flatpickr(dateInput, {
    minDate: today,
    maxDate: maxDate,
    dateFormat: "m/d/Y", // matches placeholder
    allowInput: true,
    clickOpens: false // only open via icon
  });

  // Open Flatpickr on calendar icon click
  calendarIcon.addEventListener("click", () => fp.open());

  // Keep placeholder if cleared
  dateInput.addEventListener("blur", () => {
    if (!dateInput.value) setDynamicPlaceholder();
  });

} else {
  // Desktop → native date input
  dateInput.setAttribute("type", "date");
  dateInput.min = today.toISOString().split("T")[0];
  dateInput.max = maxDate.toISOString().split("T")[0];

  // Open native picker on calendar icon click
  calendarIcon.addEventListener("click", () => {
    try {
      if (dateInput.showPicker) dateInput.showPicker();
      e
