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
const modelJson = 'https://teachablemachine.withgoogle.com/models/ZBXwb0y3v/model.json';

// Min confidence to play an audio
const confidenceThreshold = 0.95;

// Two variable to hold the label and confidence of the result
let label;
let confidence;
let action;
let audioSelect;
let monitorBtn, monitor = false;
// Initialize a sound classifier method.
let classifier;

// Initialize the pause timeout
let longPauseTimeout;

let audioIn;

const actionMapping = {
  _background_noise_: [
    'do nothing'
  ],
  conversation: [
    'do nothing'
  ],
  bye: [
    // these are supposed to be audio files
    'Good bye',
    'See ya!',
    'Thanks and until next time.'
  ],
  laughter: [
    'LOL',
    '(laughs)'
  ],
  applauding: [
    'Nice!'
  ]
};

/**
 * Load the pre-trianed custom SpeechCommands18w sound classifier model.
 */
function preload() {
  classifier = ml5.soundClassifier(modelJson, {
    probabilityThreshold: 0.7 // probabilityThreshold is 0
  });
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

  // monitor button
  monitorBtn = createButton('Monitoring On/Off');
  monitorBtn.mousePressed(setMonitoring);

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

  audioSelect = createSelect();
  deviceList.forEach(input => audioSelect.option(input.label))
  audioSelect.selected(0);
  audioSelect.changed(event => selectAudioSource(event.target.selectedIndex));

  if (deviceList.length < 0) {
    console.log('No audio inputs available.');
  }

  selectAudioSource();
}

function selectAudioSource(index = 0) {
  audioIn.setSource(index);

  // start listening to input
  audioIn.start();
  userStartAudio();
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

  results.forEach(result => console.log(nf(result.confidence, 0, 2), result.label));

  // Display error in the console
  if (error) {
    console.error(error);
  }

  // got some input, reset the pause timeout
  clearTimeout(longPauseTimeout);
  longPauseTimeout = setTimeout(longPauseCallback, 7000);

  let action = 'Undefined input, do nothing.';
  console.log(Object.keys(actionMapping), (label.toLowerCase()))
  if (confidence > confidenceThreshold && Object.keys(actionMapping).includes(label.toLowerCase())) {
    // action needed!
    const actions = actionMapping[label.toLowerCase()];
    // play random audio
    action = shuffleArray(actions)[0];
  }
  printResult(label, nf(confidence, 0, 2), action);  // Round the confidence to 0.01
}

/**
 * Enables monitoring
 */
function setMonitoring() {
  monitor = ! monitor;
  if (monitor) {
    audioIn.connect();
  } else {
    audioIn.disconnect();
  }
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
