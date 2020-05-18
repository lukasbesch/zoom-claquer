# ZOOM-CLAQUEUR
## Exploit zoom meetings attendance by using a digital assistant to avoid unpleasant silence in group conferences.
 
Embarrassing silence in video-meetings is unpleasant and mostly it hits us completely unexpectedly. This uncomfortable silence has several reasons such as distraction through side activities, inattention or uncertainty. With the following workaround, a digital assistant can be integrated into zoom meetings to maintain conversation between participants, support them or simply to spread good vibes.
 
 
## 01. Functionalities
 
| Input                        | Output                      | Implemented  |
| ---------------------------- |:---------------------------:|-------------:|
| background_noise             | Do nothing                  |      x       |
| long Pauses                  | Play random question sample |      x       |
| conversation                 | do nothing                  |      x       |
| farewell                     | Play random "bye" sample    |      x       |
| laughter                     | Play random laughter sample |      x       |
| Name is called               | Play feedback sample        |              |
| Applauding                   | Play random clap sample     |              |
| Breathing/coughing/nibbling  | Play feedback sample        |              |
| excuses / acoustic problems  | Play feedback sample        |              |
 
Just a starting point. Record your own output. Each reaction should have multiple variations to avoid repeated output.
Feel free to use your own style of slang.
 
## 02. Install
### Step 01: Routing Sound input
 
to enable an application to access your soundcard or interact with another application via the soundcard, you need an extension that allows applications to pass audio to other applications.
 
Recommended Applications:
 
Windows
- JACK Audio Connection Kit (free)
(https://jackaudio.org/downloads/)
- VB-Audio Virtual Cable or Voicemeeter (free)
(https://www.vb-audio.com/Cable/)
 
Mac
- BlackHole (free)
(https://github.com/ExistentialAudio/BlackHole)
- Soundflower (free)
(https://github.com/mattingalls/Soundflower)
- Loopback ($)  
https://rogueamoeba.com/loopback/
 
Linux
- ALSA (free)
(https://www.alsa-project.org/main/index.php/Asoundrc)
 
### Step 02: Setup Sketch
The setup should be as simple and lightweight as possible. For implementation we use p5js, ml5js and teachable machine.
 
[p5.js](https://p5js.org/) is a free and open-source JavaScript library for creative coding, with a focus on making coding accessible.
 
[ml5.js](https://ml5js.org/) aims to make machine learning approachable for a broad audience of artists, creative coders, and students. The library provides access to machine learning algorithms and models in the browser, building on top of [TensorFlow.js](https://www.tensorflow.org/js) with no other external dependencies.
 
[teachable machine by google](https://teachablemachine.withgoogle.com/) is a web-based tool that makes creating low-level machine learning models fast, easy, and accessible to everyone.
 
You can access through the following link you can just use our preset:
 
→ Quick Start: [https://codesandbox.io/s/github/lukasbesch/zoom-claquer](https://codesandbox.io/s/github/lukasbesch/zoom-claquer)
 
→ GitHub-Repository: [https://github.com/lukasbesch/zoom-claquer](https://github.com/lukasbesch/zoom-claquer)

You need to install [Yarn](https://yarnpkg.com/) first.

```bash
git clone https://github.com/lukasbesch/zoom-claquer.git
cd zoom-claquer
yarn start
```

Access the interface at http://127.0.0.1:8080 (or the URL shown in Codesandbox)
If you use Codesandbox, it is recommended to open the URL in a new window.
 
 
### Step 03: Implement into Zoom meeting
 
Choose Audio Output: Soundflower (or whatever app you use)
Choose Audio Input: Soundflower
Enable monitoring.
 
### Step 04: Fun, Fun, Fun
optional: Create your own model with teachable machine


Project for [KISD](https://kisd.de/) by [Lukas Besch](https://lukasbesch.com) & Jannik Busmann
