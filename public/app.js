// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Sound classification using pre-trained custom SpeechCommands18w and p5.js
This example uses a callback pattern to create the classifier
=== */

// const modelJson = 'https://storage.googleapis.com/tm-speech-commands/eye-test-sound-yining/model.json';
const modelJson = 'https://storage.googleapis.com/tm-model/ZBXwb0y3v/model.json';

// Min confidence to play an audio
const confidenceThreshold = 0.55;

// Two variable to hold the label and confidence of the result
let label;
let confidence;
let action;
// Initialize a sound classifier method.
let classifier;

// Initialize the pause timeout
let longPauseTimeout;

function preload() {
  // Load the pre-trianed custom SpeechCommands18w sound classifier model
  classifier = ml5.soundClassifier(modelJson);
}

function setup() {
  noCanvas();
  // ml5 also supports using callback pattern to create the classifier
  // classifier = ml5.soundClassifier(modelJson, modelReady);

  // Create 'label' and 'confidence' div to hold results
  label = createDiv('Label: ...');
  confidence = createDiv('Confidence: ...');
  action = createDiv('Action: ...');
  // Classify the sound from microphone in real time
  classifier.classify(gotResult);
}

// If you use callback pattern to create the classifier, you can use the following callback function
// function modelReady() {
//   classifier.classify(gotResult);
// }

const actionMapping = {
  bye: [
    // these are supposed to be audio files
    'Good bye',
    'See ya!',
    'Thanks and until next time.'
  ],
  applauding: [
    'Nice!'
  ]
};

const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);


// A function to run when we get any errors and the results
function gotResult(error, results) {
  const {label, confidence} = results[0];

  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);

  // got some input, reset the pause timeout
  clearTimeout(longPauseTimeout);
  longPauseTimeout = setTimeout(longPauseCallback, 7000);

  let action = 'Undefined input, do nothing.';
  if (confidence > confidenceThreshold && Object.keys(actionMapping).includes(label.toLowerCase())) {
    // action needed!
    const actions = actionMapping[label.toLowerCase()];
    // play random audio
    action = shuffleArray(actions)[0];
  }
  printResult(label, nf(confidence, 0, 2), action);  // Round the confidence to 0.01
}

function printResult(labelVal, confidenceVal, actionVal) {
  label.html('Label: ' + labelVal);
  confidence.html('Confidence: ' + confidenceVal); // Round the confidence to 0.01
  action.html('Action: ' + actionVal); // Round the confidence to 0.01
}

function longPauseCallback() {
  printResult('Long pause', 1, 'Do something?')
  // time for action
}
