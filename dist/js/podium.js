// The Marist House Cup
// src > js > podium.js
// Created on 18 November 2020
// Updated 10 December 2020 (Version 1.0)

// VARIABLES

let adminId, pointsData, klasData;
let adminLoaded = false;
let dataLoaded = false;

// FUNCTIONS

const main = () => {
  setDocumentListeners();
  setUserListener();
  setDataListener();
};

const setDocumentListeners = () => {
  $('header #sign-out').on('click', signOut);
};

const signOut = () => {
  Authentication.signOut().then(() => {
    document.location.href = './index.html';
  }).error(error => {
    console.error(error);
  });
};

const setUserListener = () => {
  Authentication.onAuthStateChanged(user => {
    if (user && isAdminEmail(user.email))
      adminId = getIdFromEmail(user.email);
      adminLoaded = true;
      if (dataLoaded)
        layoutAdmin();
  });
};

const setDataListener = () => {
  Database.collection('d').doc('d').onSnapshot(doc => recievedData(doc.data()));
};

const getIdFromEmail = email => {
  let emailComponents = email.split('@');
  emailComponents.pop();
  return emailComponents.join('');
};

const recievedData = (data) => {
  if (!(data)) return;
  const klaDataChanged = klasData === data.klasData;
  pointsData = data.pointsData;
  klasData = data.klasData;
  dataLoaded = true;
  layoutPodium();
  if (adminLoaded)
    layoutAdmin(klaDataChanged);
};

const layoutPodium = () => {
  const housePoints = totalPointsForHouses();
  const houseRanks = houseRanksFromPoints(housePoints);
  $('#podium #first .house').text(houseRanks[0].house);
  $('#podium #first .points').text(houseRanks[0].points);
  $('#podium #second .house').text(houseRanks[1].house);
  $('#podium #second .points').text(houseRanks[1].points);
  $('#podium #third .house').text(houseRanks[2].house);
  $('#podium #third .points').text(houseRanks[2].points);
  $('#podium #fourth .house').text(houseRanks[3].house);
  $('#podium #fourth .points').text(houseRanks[3].points);
};

const totalPointsForHouses = () => {
  let housePoints = { campion: 0, alman: 0, harroway: 0, stVincent: 0 };
  pointsData.forEach(pointsRecord => {
    if (pointsRecord.house === 'campion')
      housePoints.campion += pointsRecord.points;
    else if (pointsRecord.house === 'alman')
      housePoints.alman += pointsRecord.points;
    else if (pointsRecord.house === 'harroway')
      housePoints.harroway += pointsRecord.points;
    else if (pointsRecord.house === 'stVincent')
      housePoints.stVincent += pointsRecord.points;
  });
  return housePoints;
};

const houseRanksFromPoints = housePoints => {
  let houseRanks = [
    { house: 'campion', points: housePoints.campion },
    { house: 'alman', points: housePoints.alman },
    { house: 'harroway', points: housePoints.harroway },
    { house: 'stVincent', points: housePoints.stVincent }
  ];
  houseRanks.sort((a, b) => a.points < b.points);
  return houseRanks;
};

const isAdminEmail = email => {
  return typeof email === 'string' && email.includes('parra.catholic.edu.au');
};

const layoutAdmin = (klaDataChanged = true) => {
  $('header #points-link').show();
  setAdminListeners();
  if (klaDataChanged)
    clearAddPointsPopup();
    addKlaSelectOptions();
};

const setAdminListeners = () => {
  $('header #points-link').on('click', () => $('#add-points-popup').show());
  $('#add-points-popup').on('click', () => $('#add-points-popup').hide()).children().click(() => { return false });
  $('#add-points-popup #kla').on('change', klaSelectChanged);
  $('#add-points-popup #activity').on('change', activitySelectChanged);
  $('#add-points-popup .stepper .left').on('click', setStepperLess);
  $('#add-points-popup .stepper .right').on('click', setStepperGreater);
  $('#add-points-popup .stepper input').on('input', stepperInputDidChange);
  $('#add-points-popup #house-buttons a').on('click', event => didSelectHouseColor(event));
  $('#add-points-popup #actions-container button').click(submitAddPoints);
};

const klaSelectChanged = () => {
  updateRemainingPoints();
  addActivitySelectOptions();
  const klaRecord = getSelectedKlaRecord();
  const remaining = remainingPointsForKla(klaRecord);
  $('#add-points-popup .stepper input').attr({ 'max' : remaining });
  $('#add-points-popup #activity-container').show();
};

const activitySelectChanged = () => {
  let activityRecord = getSelectedActivityRecord();
  $('#add-points-popup .stepper input').val(activityRecord?.points || 1);
  stepperInputDidChange();
  $('#add-points-popup #points-container').show();
  $('#add-points-popup #house-container').show();
};

const didSelectHouseColor = event => {
  $('#add-points-popup #house-buttons a .selected-container').hide();
  const $selectedButton = $(event.currentTarget);
  $selectedButton.find('.selected-container').show();
  let selectedHouse = event.currentTarget.id;
  const $submitButton = $('#add-points-popup button');
  $submitButton.attr('id', selectedHouse);
  $submitButton.prop('disabled', false);
  if (selectedHouse === 'campion')
    selectedHouse = 'Campion';
  else if (selectedHouse === 'alman')
    selectedHouse = 'Alman';
  else if (selectedHouse === 'harroway')
    selectedHouse = 'Harroway';
  else if (selectedHouse === 'stVincent')
    selectedHouse = 'St. Vincent';
  $('#add-points-popup #selected-house').text(selectedHouse);
};

const addKlaSelectOptions = () => {
  $('#add-points-popup #permissions-container').hide();
  $('#add-points-popup #kla-container').show();
  $('#add-points-popup #kla').html(
    '<option disabled selected value>Select</option>'
  );
  let enabledKlas = 0;
  klasData.forEach(klaRecord => {
    let disabled = !klaIsEnabledForUser(klaRecord);
    if (!disabled)
      enabledKlas ++;
    $('#add-points-popup #kla').append(
      `<option value="${klaRecord.name}"${disabled ? ' disabled' : ''}>${klaRecord.name}</option>`
    );
  });
  if (enabledKlas === 0) {
    $('#add-points-popup #permissions-container').show();
    $('#add-points-popup #kla-container').hide();
  }
};

const addActivitySelectOptions = () => {
  let klaRecord = getSelectedKlaRecord();
  if (!klaRecord)
    return;
  $('#add-points-popup #activity').html(
    '<option disabled selected value>Select</option>'
  );
  klaRecord.activities.forEach(activity => {
    $('#add-points-popup #activity').append(
      `<option value="${activity.name}">${activity.name}</option>`
    );
  });
  $('#add-points-popup #activity').append(
    '<option value="Other">Other</option>'
  );
};

const setStepperLess = () => {
  let $stepperInput = $('#add-points-popup .stepper input');
  $stepperInput.val(getPointsStepperValue() - 1);
  stepperInputDidChange();
};

const setStepperGreater = () => {
  let $stepperInput = $('#add-points-popup .stepper input');
  $stepperInput.val(getPointsStepperValue() + 1);
  stepperInputDidChange();
};

const stepperInputDidChange = () => {
  let $stepperInput = $('#add-points-popup .stepper input');
  const min = parseInt($stepperInput.attr('min'));
  const max = parseInt($stepperInput.attr('max'));
  let value = getPointsStepperValue();
  if (value < min)
    value = min;
  if (value > max)
    value = max;
  $stepperInput.val(value);
};

const updateRemainingPoints = () => {
  const klaRecord = getSelectedKlaRecord();
  const remaining = remainingPointsForKla(klaRecord);
  $('#add-points-popup #remaining-points').text(`${remaining} Remaining`);
};

const getSelectedKlaRecord = () => {
  const selectedKlaName = $('#add-points-popup #kla').val();
  return klasData.find(klaRecord => klaRecord.name === selectedKlaName);
};

const getSelectedActivityRecord = () => {
  const selectedActivityName = $('#add-points-popup #activity').val();
  const klaRecord = getSelectedKlaRecord();
  const selectedActivityRecord = klaRecord.activities.find(activity => activity.name === selectedActivityName);
  return selectedActivityRecord || { name: 'Other', points: 1 };
};

const getPointsStepperValue = () => {
  return Math.round($('#add-points-popup .stepper input').val());
};

const getSelectedHouseName = () => {
  const $submitButton = $('#add-points-popup button');
  return $submitButton.attr('id');
};

const klaIsEnabledForUser = klaRecord => {
  return klaRecord.users.includes(adminId);
};

/**
 * Each KLA has 100 points except for 'Sport' which has 130.
 *
 * @param {*} klaRecord
 * @return {number} 
 */
const remainingPointsForKla = klaRecord => {
  let used = 0;
  pointsData.forEach(pointsRecord => {
    if (pointsRecord.kla === klaRecord.name)
      used += pointsRecord.points;
  });
  let remaining = 100 - used;
  if (klaRecord.name === 'Sport')
  remaining = 130 - used;
  if (remaining < 0)
    remaining = 0;
  return remaining;
};

const submitAddPoints = () => {
  showButtonLoading();
  const kla = getSelectedKlaRecord().name;
  const activity = getSelectedActivityRecord().name;
  const points = getPointsStepperValue();
  const house =  getSelectedHouseName();
  const user = adminId;
  savePointsRecord(kla, activity, points, house, user);
};

const savePointsRecord = (kla, activity, points, house, user) => {
  $('#add-points-popup #actions-container #error-message').hide();
  Database.collection('p').add({
    kla: kla,
    activity: activity,
    points: points,
    house: house,
    user: user
  }).then(() => {
    hideButtonLoading();
    clearAddPointsPopup();
  }).catch(error => {
    hideButtonLoading();
    $('#add-points-popup #actions-container #error-message').show();
  });
};

const showButtonLoading = () => {
  $('#add-points-popup #actions-container .button-text').hide();
  $('#add-points-popup #actions-container .button-loading').show();
};

const hideButtonLoading = () => {
  $('#add-points-popup #actions-container .button-text').show();
  $('#add-points-popup #actions-container .button-loading').hide();
};

const clearAddPointsPopup = () => {
  $('#add-points-popup').hide();
  $('#add-points-popup #activity-container').hide();
  $('#add-points-popup #points-container').hide();
  $('#add-points-popup #house-container').hide();
  $('#add-points-popup #kla').prop('selectedIndex', 0);
  $('#add-points-popup #activity').prop('selectedIndex', 0);
  $('#add-points-popup #house-buttons a .selected-container').hide();
  $('#add-points-popup #selected-house').text('');
  $('#add-points-popup button').attr('id', '');
};

// INITIAL SCRIPTS

main();
