// The Marist House Cup
// functions > src > index.ts
// Created on 4 December 2020
// Updated 10 December 2020 (Version 1.0)

// MODULES

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp();

// CONSTANTS

const Database = admin.firestore();

// VARIABLES

// FUNCTIONS

const pointsRecordError = (pointsRecord: any): (Error | null) => {
  const klaError = klaFieldError(pointsRecord.kla);
  if (klaError != null)
    return klaError;
  const activityError = activityFieldError(pointsRecord.activity);
  if (activityError != null)
    return activityError;
  const pointsError = pointsFieldError(pointsRecord.points);
  if (pointsError != null)
    return pointsError;
  const houseError = houseFieldError(pointsRecord.house);
  if (houseError != null)
    return houseError;
  const userError = userFieldError(pointsRecord.user);
  if (userError != null)
    return userError;
  return null;
};

const klaFieldError = (klaField: any): (Error | null) => {
  if (typeof klaField !== 'string')
    return new Error('\'kla\' field must be of type \'string\'');
  if (klaField.length > 250)
    return new Error('\'kla\' field must be 250 characters or less');
  return null;
};

const activityFieldError = (activityField: any): (Error | null) => {
  if (typeof activityField !== 'string')
    return new Error('\'activity\' field must be of type \'string\'');
  if (activityField.length > 250)
    return new Error('\'activity\' field must be 250 characters or less');
  return null;
};

const pointsFieldError = (pointsField: any): (Error | null) => {
  if (typeof pointsField !== 'number')
    return new Error('\'points\' field must be of type \'number\'');
  if (pointsField < 0 || pointsField > 100)
    return new Error('\'points\' field must have a value between 0 and 100 (inclusive)');
  return null;
};

const houseFieldError = (houseField: any): (Error | null) => {
  if (typeof houseField !== 'string')
    return new Error('\'house\' field must be of type \'string\'');
  if (houseField !== 'campion' && houseField !== 'alman' && houseField !== 'harroway' && houseField !== 'stVincent')
    return new Error('\'house\' field must have the value \'campion\', \'alman\', \'harroway\' or \'stVincent\'');
  return null;
};

const userFieldError = (userField: any): (Error | null) => {
  if (typeof userField !== 'string')
    return new Error('\'user\' field must be of type \'string\'');
  if (userField.length > 250)
    return new Error('\'user\' field must be 250 characters or less');
  return null;
};

/**
 * Whenever a document is saved to the 'p' collection, this listener function
 * will append its data to the 'pointsData' array in the document 'd\d'. The
 * initial doc must have 'kla', 'activity', 'points', 'house' and 'user' fields.
 */
exports.createPointsRecord = functions.firestore.document("p/{pointsRecordId}").onCreate((snap, context) => {
  const pointsRecord = {
    kla: snap.get('kla'),
    activity: snap.get('activity'),
    points: snap.get('points'),
    house: snap.get('house'),
    user: snap.get('user')
  };
  const pointsError = pointsRecordError(pointsRecord);
  console.log(pointsError);
  if (pointsError)
    return pointsError;
  else
    return Database.collection('d').doc('d').update({
      pointsData: admin.firestore.FieldValue.arrayUnion(pointsRecord)
    });
});
