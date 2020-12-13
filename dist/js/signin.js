// The Marist House Cup
// src > js > signin.js
// Created on 17 November 2020
// Updated 18 November 2020 (Version 1.0)

// FUNCTIONS

const main = () => {
  setDocumentListeners();
  setSignInListener();
  startSignInSequence();
};

const setDocumentListeners = () => {
  $('#error button').click(tryAgainClicked);
};

const startSignInSequence = () => {
  Authentication.onAuthStateChanged(user => {
    if (user) {
      signInSucceeded(null, user.email);
    } else
      activateSignInPopup();
  });
};

const finishSignInSequence = () => {
  hideLoading();
  document.location.href = './podium.html';
}

const activateSignInPopup = () => {
  let provider = new firebase.auth.GoogleAuthProvider();
  Authentication.signInWithRedirect(provider);
};

const setSignInListener = () => {
  Authentication.getRedirectResult()
  .then(result => signInSucceeded(result))
  .catch(error => signInFailed(error));
};

const signInSucceeded = (result, email) => {
  // Must have provided either an email address or a result with the 'credential' property
  if (!(email || (result && result.credential))) return;
  let providerId = '';
  if (email) {
    const emailComponents = email.split('@');
    providerId = emailComponents[emailComponents.length - 1];
  } else
    providerId = result.credential.providerId;
  if (emailIsValid(providerId))
    finishSignInSequence();
  else
    signInFailed({
      message: 'This Google account does not have permission to view this page. Please use your school account instead.'
    });
};

const signInFailed = (error) => {
  hideLoading();
  $('#error #message').html(error.message);
  $('#error').show();
};

const emailIsValid = (email) => {
  return typeof email === 'string' && (email.includes('parra.catholic.edu.au') || email.includes('parrastu.catholic.edu.au'));
};

const hideLoading = () => {
  $('#loading').hide();
};

const tryAgainClicked = () => {
  $('#error').hide();
  $('#loading').show();
  activateSignInPopup();
};

// INITIAL SCRIPTS

main();
