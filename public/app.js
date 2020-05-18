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
/**
 * Model JSON
 * v1: https://teachablemachine.withgoogle.com/models/ZBXwb0y3v/model.json
 * v2: https://teachablemachine.withgoogle.com/models/SMAoTQVvW/model.json
 * @type {string}
 */
const modelJson = 'https://teachablemachine.withgoogle.com/models/SMAoTQVvW/model.json';

// Two variable to hold the label and confidence of the result
let label;
let confidence;
let action;
let audioSelect;
let monitorBtn;
let monitor = true;
// Initialize a sound classifier method.
let classifier;

// Initialize the pause timeout
let longPauseTimeout;

// Min confidence to play an audio
const confidenceThreshold = 0.95;

let audioIn;
let fft;

//const sounds = [];
let sound;

const timer = {
  delay: 7000,
  start: null,
  stop: null
};

let trebHist = []; // to hold getEnergy("treble")
let midHist = []; // to hold getEnergy("mid")
let bassHist = []; // to hold getEnergy("bass")

let trebEnergy, midEnergy, bassEnergy;
let energyHist = [trebHist, midHist, bassHist]; // to hold all getEnergy() levels



var byeVoice = [];
var laughterVoice = [];
/*
const FOLDER = 'soundfiles/', EXT = '.wav',
      INDEX_START = 1, INDEX_END = 2,
      INDEX_TOTAL = 1 + INDEX_END - INDEX_START,
      sounds = Array(INDEX_TOTAL);

*/
const actionMapping = {
  _background_noise_: [
    //'do nothing'
  ],
  conversation: [
    'do nothing'
  ],
  bye: [
    // these are supposed to be audio files
    'Good bye',
    'See ya!',
    'Thanks and until next time.',
  ],
  laughter: [
    'LOL',
    '(laughs)'
  ]
};


function preload() {

  /**
   * Load the pre-trianed custom SpeechCommands18w sound classifier model.
   */

  classifier = ml5.soundClassifier(modelJson, {
    /**
     * Only results above the probabilityThreshold value will be trigger the gotResult callback.
     */
    probabilityThreshold: 0.8,

    /**
     * Whether to invoke the goResult callback on unknown input and background noise.
     */
    invokeCallbackOnNoiseAndUnknown: true,

    /**
     * The overlap factor determines how frequently the last second of audio is tested against the model you’ve made.
     * With an overlap rate of 0, audio will be classified very second.
     * With an overlap of 0.5, audio will be classified every half second.
     * You probably want between 0.5 and 0.75. More info in README
     */
    overlapFactor: 0.8,

    /**
     * Include spectogram. Where?
     */
    includeSpectrogram: true
  });

  /**
   * Load Sound Directory
   */

/*
   for (let i = 0; i < INDEX_TOTAL; ++i){
       sounds[i] = loadSound(FOLDER + (i + INDEX_START) + EXT);
       console.log(i + INDEX_START + EXT);
   }*/
   /*
   for (let i = 1; i < 5; i++) {
     sounds.push(loadSound('data/' + i + '.wav'));
   }
   */


    /// Load Soundfiles Bye
    byeVoice.push(loadSound('soundfiles/bye/102003_robinhood76_01887-goodbye-spell.wav'));
    byeVoice.push(loadSound('soundfiles/bye/213286_aderumoro_goodbye-female-friendly.wav'));
    byeVoice.push(loadSound('soundfiles/bye/235107_reitanna_japanese-goodbye.wav'));
    byeVoice.push(loadSound('soundfiles/bye/323212_alivvie_goodbye.wav'));
    byeVoice.push(loadSound('soundfiles/bye/339159_girlhurl_see-you-soon.wav'));
    byeVoice.push(loadSound('soundfiles/bye/343893__reitanna__mmbye.wav'));
    byeVoice.push(loadSound('soundfiles/bye/376967_kathid_goodbye-high-quality.wav'));
    byeVoice.push(loadSound('soundfiles/bye/411067_1475061_goodbye.wav'));
    byeVoice.push(loadSound('soundfiles/bye/417197_theliongirl10_me-saying-bye.wav'));
    byeVoice.push(loadSound('soundfiles/bye/44745_matteusnova_adios.wav'));
    byeVoice.push(loadSound('soundfiles/bye/505439_rugmoth_annoyed-goodbye.wav'));


    /// Load Soundfiles – Laughter
    laughterVoice.push(loadSound('soundfiles/laughter/100426_nfrae_idunno_01.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/119450_lmbubec_girl-laugh.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/16127_hanstimm_hanstimm-laughs-a1.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/16131_hanstimm_hanstimm-laughs-a2.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/169799_missozzy_female-laughing-01.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/19151_fratz_laughing1.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/198248_unfa_laughter-04.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/254289_jagadamba_male-laugh-laughter.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/341036_vikuserro_hehehe-laughter.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/442597_mafon2_hysterical-laughter.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/46599_dobroide_20080108-female-laughing-02.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/467748_sgak_laughter.wav'));
    laughterVoice.push(loadSound('soundfiles/laughter/475212_jodybruchon_voices-female-laughter-guffaw.wav'));

 }


/**
 * Set up
 */
function setup() {


  //noCanvas();
  // ml5 also supports using callback pattern to create the classifier
  // classifier = ml5.soundClassifier(modelJson, modelReady);

  // sel.position(10, 10);
  // sel.option('pear');
  // sel.option('kiwi');
  // sel.option('grape');
  // sel.selected('kiwi');

  // Create 'label' and 'confidence' div to hold results
  label = createDiv('Label: ...');
  confidence = createDiv('Confidence: ...');
  action = createDiv('Action: ...');
  // Classify the sound from microphone in real time
  classifier.classify(gotResult);

  // get the audio sources
  audioIn = new p5.AudioIn();
  audioIn.getSources(gotSources);
  //audioIn.start();

  fft = new p5.FFT();
  fft.setInput(audioIn);


  // setup basic input level indicator


  createCanvas(400, 100);
  //let canvasSound = createCanvas(300, 100);
  monitorBtn = createCheckbox('Monitoring On/Off', true);
  monitorBtn.changed(setMonitoring);

}

/**
 * Render the input level indicator
 */
function draw() {
  background(0, 15);
  noStroke();
  fill(255);
  if(monitor == false){
    fill(0);
	}
	else if (monitor == true){
    analyzeEnergy();
    drawFTT();
	}



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

  // monitor the output to the master output
  audioIn.connect();
}

/**
 * Process a recognized speech command.
 *
 * @param error
 * @param results
 */
function gotResult(error, results, asdf) {
  //console.log(asdf);
  // The results are in an array ordered by confidence.
  const {label, confidence} = results[0];

  results.forEach(result => console.log(nf(result.confidence, 0, 2), result.label));

  // Display error in the console
  if (error) {
    console.error(error);
    return;
  }

  // got some input, reset the pause timeout
  //clearTimeout(longPauseTimeout);
  //longPauseTimeout = setTimeout(longPauseCallback, 7000);

  let action = 'Undefined input, do nothing.';
  if (confidence > confidenceThreshold && Object.keys(actionMapping).includes(label.toLowerCase())) {
    // action needed!
    const actions = actionMapping[label.toLowerCase()];
    // play random audio
    action = shuffleArray(actions)[0];

    if(label == "Laughter"){
      random(laughterVoice).play();

    }

    else if (label == "Bye"){
      random(byeVoice).play();

    }

    else if (label == "Conversation"){

    }

    else if (label == "_background_noise_"){
      //random(byeVoice).play();
      //longPauseTimeout = setTimeout(longPauseCallback, 7000);
      //clearTimeout(longPauseTimeout);
      //clearTimeout(longPauseTimeout);
      timerTrigger();
      console.log('timer: '+ timer);
    }

    else {

    }

  }
  printResult(label, nf(confidence, 0, 2), action);  // Round the confidence to 0.01
}

/**
 * Enables monitoring
 */
function setMonitoring() {
  monitor = ! monitor;
  if (this.checked()) {
    audioIn.connect();
  } else {
    audioIn.disconnect();
  }
  console.log('monitor:' + monitor);
}


/**
 * Drawing Mic Input as FTT
 */

function drawFTT() {
  let spectrum = fft.analyze();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let y = map(spectrum[i], 0, 255, height, 0);
    ellipse(x, y, 3, 3);
  }
}

function analyzeEnergy() {
  trebEnergy = fft.getEnergy("treble");
  midEnergy= fft.getEnergy("mid");
  bassEnergy = fft.getEnergy("bass");

  trebHist.push(trebEnergy);
  midHist.push(midEnergy);
  bassHist.push(bassEnergy);

  if (bassEnergy < 96) {
    console.log('Silence');
  }

  return bassEnergy;
}

function printResult(labelVal, confidenceVal, actionVal) {
  label.html('Label: ' + labelVal);
  confidence.html('Confidence: ' + confidenceVal); // Round the confidence to 0.01
  action.html('Action: ' + actionVal); // Round the confidence to 0.01
}

function timerTrigger() {
  timer.start = int(millis());
  timer.stop = timer.start + timer.delay;
}

function runTimer() {
  return timer.stop > int(millis());
}

function longPauseCallback() {
  printResult('Long pause', 1, 'Do something?');
  // time for action
  console.log('Long pause', 1, 'Do something?');
}
