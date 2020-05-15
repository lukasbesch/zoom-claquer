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

let audioIn;

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

/**
 * Load the pre-trianed custom SpeechCommands18w sound classifier model.
 */
function preload() {
  classifier = ml5.soundClassifier(modelJson);
}

/**
 * Set up
 */
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

  // get the audio sources
  audioIn = new p5.AudioIn();
  audioIn.getSources(gotSources);

  // setup basic input level indicator
  createCanvas(100, 100);
}

/**
 * Render the input level indicator
 */
function draw() {
  background(0);
  fill(255);
  const micLevel = audioIn.getLevel();
  let y = 100 - micLevel * 100;
  ellipse(width/2, y, 10, 10);
}

/**
 * Process the available audio sources.
 *
 * @param deviceList
 */
function gotSources(deviceList) {
  if (deviceList.length < 0) {
    console.log('No audio inputs available.');
    return;
  }

  // Find the desired input source
  const inputLabel = 'blackhole';
  const input = deviceList
    .findIndex(input => input.label.toLowerCase().includes(inputLabel));
  if (! input) {
    console.log(`Audio input ${inputLabel} is not available.`);
    return;
  }

  // set the source
  audioIn.setSource(input);
  console.log(`set source to: ${deviceList[audioIn.currentSource].deviceId}`);

  // start listening to input
  audioIn.start();
  userStartAudio();

  // monitor the output to the master output
  audioIn.connect();
}

/**
 * Process a recognized speech command.
 *
 * @param error
 * @param results
 */
function gotResult(error, results) {
  // The results are in an array ordered by confidence.
  const {label, confidence} = results[0];
  console.log(results);

  // Display error in the console
  if (error) {
    console.error(error);
  }

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
