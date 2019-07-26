"use strict";

const calendar = document.querySelector(".Calendar");
const gridOfDays = document.querySelector(".grid-days");
const textMonth = document.querySelector("#current-month");
const back = document.querySelector("#back");
const next = document.querySelector("#next");

let holidays = [];
const monthsInSpanish = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre"
];

let dates = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  firstDay() {
    return new Date(this.year, this.month, 1);
  },
  lastDay() {
    return new Date(this.year, this.month + 1, 0);
  },
  daysOfMonth() {
    return this.lastDay().getDate();
  },
  fistDayOfMonth() {
    return this.firstDay().getDay() + 1;
  },
  quantityOfmonths() {
    return new Date(this.year).getMonth();
  },
  hollydays: []
};

/* Asigno valor del request a dates.holidays.*/
const initCalendar = dataRequest => {
  dates.hollydays = dataRequest;
  renderCalendar(dates.hollydays);
  currentDay();
  calendar.classList.add("show");
};

/* Valido que la fecha actual sea igual a la fecha en el objeto dates. Si es igual agrego clase de css para resaltar ese día. */
const currentDay = () => {
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();
  const today = new Date().getDate();
  if (currentYear == dates.year && currentMonth == dates.month) {
    document.querySelector(`[data-day='${today}']`).classList.add("today");
  }
};

/* Hago un fecth a la API y le paso el resultado del request a la funcion initCalendar(). Antes valido si existen errores. */
const handleError = err => {
  console.log(err);
};

async function getholidays(year) {
  try {
    const response = await fetch(
      `http://nolaborables.com.ar/api/v2/feriados/${year}?formato=mensual`
    );

    if (response.status !== 200) {
      throw new Error(response.status);
    }

    const data = await response.json();
    initCalendar(data);
  } catch (err) {
    handleError(err);
  }
}

/* Inicio funcion asíncrona para traer todos los feriados del año actual */
getholidays(dates.year);

const getQuantityOfDays = d => {
  let days = [];
  for (let i = 1; i <= d; i++) {
    days.push(i);
  }
  return days;
};

const setNameMonths = months => {
  let nameMonths = [];
  for (let i = 0; i <= months; i++) {
    nameMonths[i] = monthsInSpanish[i];
  }
  return nameMonths;
};

const custumHolidays = holi => {
  if (holi.length != 0) {
    holi.forEach(element => {
      holidays.push(element);
    });

    const currentholidays = holidays[dates.month];
    const holidaysDelMes = Object.keys(currentholidays);

    holidaysDelMes.forEach(element => {
      document
        .querySelector(`[data-day='${element}']`)
        .classList.add("feriado");
    });
  }
};

/* Inserto todos los días correspondientes a cada mes en el DOM. Al utilizar CSS GRID puedo decidir en que columna comienza a completar con días en base al primer día de dicho mes. Ej: Si el primer día del mes cae un Martes, se empieza a completar con días a partir de la columna 3 */
function renderCalendar(holi = []) {
  const currentDaysInMonth = getQuantityOfDays(dates.daysOfMonth());
  const currentMonth = setNameMonths(dates.quantityOfmonths());

  gridOfDays.innerHTML = "";

  currentDaysInMonth.forEach(item => {
    let html;
    html = `<div data-day='${item}' class="Grid__item">${item}</div>`;
    gridOfDays.innerHTML += html;
  });

  gridOfDays.children[0].classList.add(`col-start-${dates.fistDayOfMonth()}`);
  textMonth.innerHTML = currentMonth[dates.month];

  custumHolidays(holi);
}

const setNextDates = () => {
  if (dates.month == 11) {
    dates.month = 0;
    dates.year += 1;
  } else {
    dates.month += 1;
  }
};

const setPrevDates = () => {
  if (dates.month == 0) {
    dates.month = 11;
    dates.year -= 1;
    getholidays(dates.year);
  } else {
    dates.month -= 1;
  }
};

next.addEventListener("click", function() {
  setNextDates();
  /* Valido que el año actual sea menor al año en dates.year. Si el año en dates.year es mayor paso como parámetro un array vacío ya que la API de nolaborables no trea los feriados de los próximos años. */
  new Date().getFullYear() < dates.year
    ? renderCalendar([])
    : renderCalendar(dates.hollydays);
  currentDay();
});

back.addEventListener("click", function() {
  setPrevDates();
  /* Valido que el año actual sea menor al año en dates.year. Si el año en dates.year es mayor paso como parámetro un array vacío ya que la API de nolaborables no trea los feriados de los próximos años. */
  new Date().getFullYear() < dates.year
    ? renderCalendar([])
    : renderCalendar(dates.hollydays);
  currentDay();
});
