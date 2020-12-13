// The Marist House Cup
// src > js > podium.js
// Created on 7 December 2020
// Updated 7 December 2020 (Version 1.0)

// MODULES

// CONSTANTS

// VARIABLES

// FUNCTIONS

const main = () => {
  setTimeout(() => {
    saveKlasData();
    // savePointsData();
  }, 5000);
};

const saveKlasData = () => {
  if (klasData == null) {
    console.error('No data');
    return;
  }
  Database.collection('d').doc('d').update({
    klasData: firebase.firestore.FieldValue.arrayUnion(...klasData)
  }).then(() => {
    console.log('Worked');
  }).error(error => {
    console.error(error);
  });
};

const savePointsData = () => {
  if (pointsData == null) {
    console.error('No data');
    return;
  }
  Database.collection('d').doc('d').update({
    pointsData: firebase.firestore.FieldValue.arrayUnion(...pointsData)
  }).then(() => {
    console.log('Worked');
  }).error(error => {
    console.error(error);
  });
};

main();
