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

let curentDate = new Date();

const dataRaces = {};

//1. Знаходимо елементи вікна
const refs = findElementWindow();

//2. Підключаємо приблуду для роботи з датами
connectFlatpickr();

//3. Підключаємо обробники подій
connectEvents(refs);

//4. Читаємо дані із сховища
loadSaveData(dataRaces);

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
  //TODO
  console.log('loadSaveData');
}

function saveData(dataRaces) {
  //TODO
  console.log('saveData');
}

function addWinnertoData(data) {
  const newResult = getNewElmentRace();
  curentInfornation.push(newResult);
  newResult.winer = data;
}

function addResultRaceToLastData(data) {
  curentInfornation.at(-1).results = data;
}

//Show  data in window
function deActivateElementWindow() {
  //Заборонии можливість вибору дати і запуску нового забігу
  //TODO
}

function activateElementWindow() {
  //Активувати можливість вибору дати і запуску нового забігу
  //TODO
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
  //TODO
  //формувати html
  //Всунути в елемент

  //Знайти номер останнього заїзду
  //активувати останній елемент
  //curentInfornation

  //Вивести для активного заїзду всі дані
  let numberRaces = 1;
  showRaces(numberRaces);
}

function addToTableWinner(data) {
  //Додати на екран в таблицю переможця один запис
  //TODO
}

// ! Race
function showActiveResultLastRace() {
  //Вивести результат останнього заїзду
  //TODO
}

function showRaces(numberRaces) {
  //TODO
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
  curentDate = selectedDates[0].setHours(0, 0, 0, 0);
  curentInfornation = getCurentInformation(curentDate, dataRaces);

  //1. Змінити заголовок з датою
  changeTitleDate(curentDate);
  //2. ВИвести результати в таблиці
  showTableWinner();
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

// ! ----------------------------------------------------
function startRase(horses) {
  const race = horses.map(runHorse);

  Promise.race(race).then(result => {
    //Вивести переможця заїзду

    console.log('First finished');

    addWinnertoData(result);

    //Show to screen
    addToTableWinner(result);
  });

  Promise.all(race).then(results => {
    //Вивести Результати заїзду
    console.log('Result race');

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
    const time = getRandomTime(2000, 3500);
    setTimeout(() => {
      resolve({ horse, time });
    }, time);
  });
}

function getRandomTime(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
