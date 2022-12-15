"use strict";
const horses = [
  "Horse1",
  "Horse2",
  "Horse3",
  "Horse4",
  "Horse5",
  "Horse6",
  "Horse7",
  "Horse8",
  "Horse9",
  "Horse10",
];

function startRase(horses) {
  const race = horses.map(run);
  Promise.all(race).then((results) => {
    console.log("Result race");
    results.sort((a, b) => a.time - b.time);
    console.log(results);
  });

  Promise.race(race).then((result) => {
    console.log("First finished");

    console.log(result);
  });
}

function run(horse) {
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

startRase(horses);

// run('Star')
//   .then(result => console.log(result))
//   .catch(error => console.log(error));
