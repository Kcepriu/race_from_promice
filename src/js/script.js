'use strict';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
require('flatpickr/dist/themes/material_blue.css');

const horses = [
  'Horse1',
  'Horse2',
  'Horse3',
  'Horse4',
  'Horse5',
  'Horse6',
  'Horse7',
  'Horse8',
  'Horse9',
  'Horse10',
];
const MIN_TIME_RACE = 2000;
const MAX_TIME_RACE = 3500;
const KEY_LOCAL_SROREGE = 'history_races_ippodrom';
const CLASS_NAME_ACTIVE_ROW = 'active_row';

let curentDate = new Date();

let dataRaces = {};

//1. Знаходимо елементи вікна
const refs = findElementWindow();

//2. Підключаємо приблуду для роботи з датами
connectFlatpickr();

//3. Підключаємо обробники подій
connectEvents(refs);

//4. Читаємо дані із сховища
dataRaces = loadSaveData();

//5. Виводимо дату
changeTitleDate(curentDate);

//6. Читаємо дані за поточну дату
let curentInfornation = getCurentInformation(curentDate, dataRaces);

//7. Промальовуємо дані в таблицю
showTableWinner();

//------------------------------------
function findElementWindow() {
  return {
    titleDate: document.querySelector('[data-title-date]'),
    inputDate: document.querySelector('[data-input-date]'),
    btnStart: document.querySelector('[data-start]'),
    tableWinner: document.querySelector('[data-winner]'),
    tableRaces: document.querySelector('[data-races]'),
  };
}
//{ winer: {}, results: [] }

// Data races
// const dataRaces = {
//   "01-01-01" :  [
//     {
//       winer: { horse: 'Star', time: 256 },
//       results: [
//         { horse: 'Star', time: 256 },
//         { horse: 'Star', time: 256 },
//         { horse: 'Star', time: 256 },
//       ],
//     },
//   ],
// };

function getCurentInformation(data, dataRaces) {
  const startDay = data.setHours(0, 0, 0, 0);
  if (!dataRaces[startDay]) {
    dataRaces[startDay] = [];
  }
  return dataRaces[startDay];
}

function newResult() {
  return {
    horse: '',
    time: 0,
  };
}

function getNewElmentRace() {
  return {
    winer: newResult(),
    results: [],
  };
}

function loadSaveData(dataRaces) {
  try {
    const serializedState = localStorage.getItem(KEY_LOCAL_SROREGE);

    return serializedState === null ? {} : JSON.parse(serializedState);
  } catch (error) {
    console.log('error loadSaveData');
  }
  return {};
}

function saveData(dataRaces) {
  localStorage.setItem(KEY_LOCAL_SROREGE, JSON.stringify(dataRaces));
}

function addWinnertoData(data) {
  const newResult = getNewElmentRace();
  const lastNumber = curentInfornation.push(newResult);
  newResult.winer = data;

  saveData(dataRaces);

  return lastNumber;
}

function addResultRaceToLastData(data) {
  curentInfornation.at(-1).results = data;
  saveData(dataRaces);
}

//Show  data in window
function deActivateElementWindow() {
  //Заборонии можливість вибору дати і запуску нового забігу
  disableElement(refs.inputDate);
  disableElement(refs.btnStart);
}

function activateElementWindow() {
  //Активувати можливість вибору дати і запуску нового забігу
  enableElement(refs.inputDate);
  enableElement(refs.btnStart);
}

// ! Animation
function startAnimation() {
  //TODO
}

function stopAnimation() {
  //TODO
}

// ! Winner
function showTableWinner() {
  //Показати ВСЮ таблицю переможців
  refs.tableWinner.innerHTML = getHtmlStrTableWinner(curentInfornation);

  //Вивести для активного заїзду всі дані
  showActiveResultLastRace();
}

function addToTableWinner(data, number) {
  //Додати на екран в таблицю переможця один запис

  refs.tableWinner.insertAdjacentHTML('beforeend', gethtmlStrRow(data, number));
}

// ! Race
function showActiveResultLastRace() {
  //Вивести результат останнього заїзду
  showRaces(curentInfornation.length);

  remoteActiveAllRows(refs.tableWinner);
  addActiveFromRow(refs.tableWinner, curentInfornation.length);
}

function showRaces(numberRaces) {
  //show information from curent races
  refs.tableRaces.innerHTML = getHtmlStrTAb(
    curentInfornation[numberRaces - 1]?.results
  );
}

// * TitleDate
function changeTitleDate(curentDate) {
  var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  refs.titleDate.textContent = curentDate.toLocaleDateString('uk-UA', options);
}

// * Events
function connectEvents(refs) {
  refs.btnStart.addEventListener('click', onClickStart);
  refs.tableWinner.addEventListener('click', onClickWinner);
}

function onClickStart(event) {
  // Деактивувати вибір дат і кнопку
  deActivateElementWindow();

  // запутити анімацію
  startAnimation();

  //Запустити старт заїзда.
  startRase(horses);
}

function onSelectedDataTime(selectedDates) {
  curentDate = selectedDates[0];
  curentInfornation = getCurentInformation(curentDate, dataRaces);

  //1. Змінити заголовок з датою
  changeTitleDate(curentDate);
  //2. ВИвести результати в таблиці
  showTableWinner();
}

function onClickWinner(event) {
  remoteActiveAllRows(refs.tableWinner);
  addActiveFromRow(refs.tableWinner, event.target.parentElement.rowIndex);
  showRaces(event.target.parentElement.rowIndex);
}
// * flatpickr
function connectFlatpickr() {
  flatpickr(refs.inputDate, getOptionFlatpickr());
}

function getOptionFlatpickr() {
  return {
    enableTime: false,
    time_24hr: true,
    defaultDate: curentDate,
    minuteIncrement: 1,

    onClose: onSelectedDataTime,
  };
}

// * ----------------------------------------------------
function startRase(horses) {
  const race = horses.map(runHorse);

  Promise.race(race).then(result => {
    //Вивести переможця заїзду
    const number = addWinnertoData(result);

    //Show to screen
    addToTableWinner(result, number);
    showActiveResultLastRace();
  });

  Promise.all(race).then(results => {
    //Вивести Результати заїзду

    //Сортуємо переможців
    results.sort((a, b) => a.time - b.time);

    // додаємо в осиінній запис інформацію про забіг
    addResultRaceToLastData(results);

    //Show to screen
    showActiveResultLastRace();

    // активувати вибір дат і кнопку
    activateElementWindow();

    // запуНИТИ анімацію
    stopAnimation();
  });
}

function runHorse(horse) {
  return new Promise((resolve, reject) => {
    const time = getRandomTime(MIN_TIME_RACE, MAX_TIME_RACE);
    setTimeout(() => {
      resolve({ horse, time });
    }, time);
  });
}

function getRandomTime(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// * Disable Enambe elements
function disableElement(element) {
  element.setAttribute('disabled', '');
}

function enableElement(element) {
  element.removeAttribute('disabled');
}

function gethtmlStrRow(data, number) {
  return `
            <tr data-number-rows-${number}>
              <td>${number}</td>
              <td>${data.horse}</td>
              <td>${data.time}</td>
            </tr>
            `;
}

function getHtmlStrTAb(resulrRace) {
  if (!resulrRace) return '';

  let result = '';
  for (let i = 0; i < resulrRace.length; i++) {
    result += gethtmlStrRow(resulrRace[i], i + 1);
  }
  return result;
}

function getHtmlStrTableWinner(results) {
  let result = '';
  for (let i = 0; i < results.length; i++) {
    result += gethtmlStrRow(results[i].winer, i + 1);
  }
  return result;
}

function remoteActiveAllRows(table) {
  const activeRow = table.querySelectorAll(`.${CLASS_NAME_ACTIVE_ROW}`);
  for (const row of activeRow) {
    row.classList.remove(CLASS_NAME_ACTIVE_ROW);
  }
}
function addActiveFromRow(table, number) {
  const row = table.querySelector(`[data-number-rows-${number}]`);
  if (row) {
    row.classList.add(CLASS_NAME_ACTIVE_ROW);
  }
}
