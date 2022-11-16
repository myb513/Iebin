const socket = io();

//google login api

const fs = require('fs').promises;
const path = require('path');
const process = require('process/');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/contacts.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Print the display name if available for 10 connections.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listConnectionNames(auth) {
  const service = google.people({version: 'v1', auth});
  const res = await service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 10,
    personFields: 'names,emailAddresses',
  });
  const connections = res.data.connections;
  if (!connections || connections.length === 0) {
    console.log('No connections found.');
    return;
  }
  console.log('Connections:');
  connections.forEach((person) => {
    if (person.names && person.names.length > 0) {
      console.log(person.names[0].displayName);
    } else {
      console.log('No display name found for connection.');
    }
  });
}

authorize().then(listConnectionNames).catch(console.error);

//stt api 
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

//음성인식 api 불러오기
const speechsdk = require('microsoft-cognitiveservices-speech-sdk');
let speechLanguage = "ko-KR"; // 디폴트 음성언어는 한국어. (11/15)
let translateFrom = "ko"; // 디폴트 번역 전 언어는 한국어. (11/15)
let translateTo = "en"; // 디폴트 번역 후 언어는 한국어. (11/15)

//버튼 객체참조
const startbtn = document.querySelector("#startSpeech"); //pug 파일의 버튼 id와 같은걸로


const myFace = document.querySelector("#myFace");
const muteBtn = document.querySelector("#mute");
const muteIcon = muteBtn.querySelector(".muteIcon");
const unMuteIcon = muteBtn.querySelector(".unMuteIcon");
const cameraBtn = document.querySelector("#camera");
const cameraIcon = cameraBtn.querySelector(".cameraIcon");
const unCameraIcon = cameraBtn.querySelector(".unCameraIcon");
const camerasSelect = document.querySelector("#cameras");

const call = document.querySelector("#call");
const welcome = document.querySelector("#welcome");

const HIDDEN_CN = "hidden";
call.classList.add(HIDDEN_CN);

let myStream;
let muted = true;
unMuteIcon.classList.add(HIDDEN_CN);
let cameraOff = false;
unCameraIcon.classList.add(HIDDEN_CN);
let roomName = "";
let nickname = "";
let peopleInRoom = 1;

// 초대 링크로 들어온 경우
if (invite === "1") {
  socket.emit("join_room", iroomName, inickName);
}

let pcObj = {
  // remoteSocketId: pc
};

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks();
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;

      if (currentCamera.label == camera.label) {
        option.selected = true;
      }

      camerasSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

async function getMedia(deviceId) {
  const initialConstraints = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstraints
    );

    // stream을 mute하는 것이 아니라 HTML video element를 mute한다.
    myFace.srcObject = myStream;
    myFace.muted = true;

    if (!deviceId) {
      // mute default
      myStream //
        .getAudioTracks()
        .forEach((track) => (track.enabled = false));

      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
}

function handleMuteClick() {
  myStream //
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (muted) {
    unMuteIcon.classList.remove(HIDDEN_CN);
    muteIcon.classList.add(HIDDEN_CN);
    muted = false;
  } else {
    muteIcon.classList.remove(HIDDEN_CN);
    unMuteIcon.classList.add(HIDDEN_CN);
    muted = true;
  }
}

function handleCameraClick() {
  myStream //
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraIcon.classList.remove(HIDDEN_CN);
    unCameraIcon.classList.add(HIDDEN_CN);
    cameraOff = false;
  } else {
    unCameraIcon.classList.remove(HIDDEN_CN);
    cameraIcon.classList.add(HIDDEN_CN);
    cameraOff = true;
  }
}

async function handleCameraChange() {
  try {
    await getMedia(camerasSelect.value);
    if (peerConnectionObjArr.length > 0) {
      const newVideoTrack = myStream.getVideoTracks()[0];
      peerConnectionObjArr.forEach((peerConnectionObj) => {
        const peerConnection = peerConnectionObj.connection;
        const peerVideoSender = peerConnection
          .getSenders()
          .find((sender) => sender.track.kind == "video");
        peerVideoSender.replaceTrack(newVideoTrack);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

/////////////////////////////////// prototype
// Screen Sharing

let captureStream = null;

async function startCapture() {
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const screenVideo = document.querySelector("#screen");
    screenVideo.srcObject = captureStream;
  } catch (error) {
    console.error(error);
  }
}

// Welcome Form (choose room)

call.classList.add(HIDDEN_CN);
// welcome.hidden = true;

const welcomeForm = welcome.querySelector("form");
console.log(welcomeForm.querySelector("#roomName"));

async function initCall() {
  welcome.hidden = true;
  call.classList.remove(HIDDEN_CN);
  await getMedia();
}

async function handleWelcomeSubmit(event) {
  event.preventDefault();

  if (socket.disconnected) {
    socket.connect();
  }

  const welcomeRoomName = welcomeForm.querySelector("#roomName");
  const welcomeNickname = welcomeForm.querySelector("#nickname");
  const nicknameContainer = document.querySelector("#userNickname");
  roomName = welcomeRoomName.value;
  welcomeRoomName.value = "";
  nickname = welcomeNickname.value;
  welcomeNickname.value = "";
  nicknameContainer.innerText = nickname;
  socket.emit("join_room", roomName, nickname);
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Chat Form

const chatForm = document.querySelector("#chatForm");
const chatBox = document.querySelector("#chatBox");

const MYCHAT_CN = "myChat";
const NOTICE_CN = "noticeChat";

chatForm.addEventListener("submit", handleChatSubmit);

function handleChatSubmit(event) {
  event.preventDefault();
  const chatInput = chatForm.querySelector("input");
  const message = chatInput.value;
  chatInput.value = "";
  socket.emit("chat", `${nickname}: ${message}`, roomName);
  writeChat(`You: ${message}`, MYCHAT_CN);
}

function writeChat(message, className = null) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerText = message;
  li.appendChild(span);
  li.classList.add(className);
  chatBox.prepend(li);
}

// Leave Room

const leaveBtn = document.querySelector("#leave");

function leaveRoom() {
  socket.disconnect();

  call.classList.add(HIDDEN_CN);
  welcome.hidden = false;

  peerConnectionObjArr = [];
  peopleInRoom = 1;
  nickname = "";

  myStream.getTracks().forEach((track) => track.stop());
  const nicknameContainer = document.querySelector("#userNickname");
  nicknameContainer.innerText = "";

  myFace.srcObject = null;
  clearAllVideos();
  clearAllChat();
}

function removeVideo(leavedSocketId) {
  const streams = document.querySelector("#streams");
  const streamArr = streams.querySelectorAll("div");
  streamArr.forEach((streamElement) => {
    if (streamElement.id === leavedSocketId) {
      streams.removeChild(streamElement);
    }
  });
}

function clearAllVideos() {
  const streams = document.querySelector("#streams");
  const streamArr = streams.querySelectorAll("div");
  streamArr.forEach((streamElement) => {
    if (streamElement.id != "myStream") {
      streams.removeChild(streamElement);
    }
  });
}

function clearAllChat() {
  const chatArr = chatBox.querySelectorAll("li");
  chatArr.forEach((chat) => chatBox.removeChild(chat));
}

leaveBtn.addEventListener("click", leaveRoom);

// Modal code

const modal = document.querySelector(".modal");
const modalText = modal.querySelector(".modal__text");
const modalBtn = modal.querySelector(".modal__btn");

function paintModal(text) {
  modalText.innerText = text;
  modal.classList.remove(HIDDEN_CN);

  modal.addEventListener("click", removeModal);
  modalBtn.addEventListener("click", removeModal);
  document.addEventListener("keydown", handleKeydown);
}

function removeModal() {
  modal.classList.add(HIDDEN_CN);
  modalText.innerText = "";
}

function handleKeydown(event) {
  if (event.code === "Escape" || event.code === "Enter") {
    removeModal();
  }
}

// Socket code

socket.on("reject_join", () => {
  // Paint modal
  paintModal("Sorry, The room is already full.");

  // Erase names
  const nicknameContainer = document.querySelector("#userNickname");
  nicknameContainer.innerText = "";
  roomName = "";
  nickname = "";
});

socket.on("accept_join", async (userObjArr) => {
  await initCall();

  const length = userObjArr.length;
  if (length === 1) {
    return;
  }

  writeChat("Notice!", NOTICE_CN);
  for (let i = 0; i < length - 1; ++i) {
    try {
      const newPC = createConnection(
        userObjArr[i].socketId,
        userObjArr[i].nickname
      );
      const offer = await newPC.createOffer();
      await newPC.setLocalDescription(offer);
      socket.emit("offer", offer, userObjArr[i].socketId, nickname);
      writeChat(`__${userObjArr[i].nickname}__`, NOTICE_CN);
    } catch (err) {
      console.error(err);
    }
  }
  writeChat("is in the room.", NOTICE_CN);
});

socket.on("offer", async (offer, remoteSocketId, remoteNickname) => {
  try {
    const newPC = createConnection(remoteSocketId, remoteNickname);
    await newPC.setRemoteDescription(offer);
    const answer = await newPC.createAnswer();
    await newPC.setLocalDescription(answer);
    socket.emit("answer", answer, remoteSocketId);
    writeChat(`notice! __${remoteNickname}__ joined the room`, NOTICE_CN);
  } catch (err) {
    console.error(err);
  }
});

socket.on("answer", async (answer, remoteSocketId) => {
  await pcObj[remoteSocketId].setRemoteDescription(answer);
});

socket.on("ice", async (ice, remoteSocketId) => {
  await pcObj[remoteSocketId].addIceCandidate(ice);
});

socket.on("chat", (message) => {
  writeChat(message);
});

socket.on("leave_room", (leavedSocketId, nickname) => {
  removeVideo(leavedSocketId);
  writeChat(`notice! ${nickname} leaved the room.`, NOTICE_CN);
  --peopleInRoom;
  sortStreams();
});

// RTC code

function createConnection(remoteSocketId, remoteNickname) {
  const myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", (event) => {
    handleIce(event, remoteSocketId);
  });
  myPeerConnection.addEventListener("addstream", (event) => {
    handleAddStream(event, remoteSocketId, remoteNickname);
  });
  // myPeerConnection.addEventListener(
  //   "iceconnectionstatechange",
  //   handleConnectionStateChange
  // );
  myStream //
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));

  pcObj[remoteSocketId] = myPeerConnection;

  ++peopleInRoom;
  sortStreams();
  return myPeerConnection;
}

function handleIce(event, remoteSocketId) {
  if (event.candidate) {
    socket.emit("ice", event.candidate, remoteSocketId);
  }
}

function handleAddStream(event, remoteSocketId, remoteNickname) {
  const peerStream = event.stream;
  paintPeerFace(peerStream, remoteSocketId, remoteNickname);
}

function paintPeerFace(peerStream, id, remoteNickname) {
  const streams = document.querySelector("#streams");
  const div = document.createElement("div");
  div.id = id;
  const video = document.createElement("video");
  video.autoplay = true;
  video.playsInline = true;
  video.width = "400";
  video.height = "400";
  video.srcObject = peerStream;
  const nicknameContainer = document.createElement("h3");
  nicknameContainer.id = "userNickname";
  nicknameContainer.innerText = remoteNickname;

  div.appendChild(video);
  div.appendChild(nicknameContainer);
  streams.appendChild(div);
  sortStreams();
}

function sortStreams() {
  const streams = document.querySelector("#streams");
  const streamArr = streams.querySelectorAll("div");
  streamArr.forEach((stream) => (stream.className = `people${peopleInRoom}`));
}

//음성인식 이벤트리스너 
async function handleSpeechClick() {

  //음성인식 코드
  const speechConfig = speechsdk.SpeechConfig.fromSubscription("6b56e306d60644f1b2563bc8dbf26cd1","koreacentral");  //번역 API 키값 유동적
  speechConfig.speechRecognitionLanguage = speechLanguage;
  
  const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();


  const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizeOnceAsync(result => {
    let displayText;

    if (result.reason === speechsdk.ResultReason.RecognizedSpeech) {
        displayText = `${result.text}`
        console.log(displayText);
        writeChat(displayText);
         //번역 코드
        axios({
          baseURL: "https://api.cognitive.microsofttranslator.com",
          url: '/translate',
          method: 'post',
          headers: {
              'Ocp-Apim-Subscription-Key': "2a2f2653bf284b8fa7c33c656156823b",  //번역 API 키값 유동적
              'Ocp-Apim-Subscription-Region': "koreacentral",
              'Content-type': 'application/json',
              'X-ClientTraceId': uuidv4().toString()
          },
          params: {
              'api-version': '3.0',
              'from': translateFrom,
              'to': [translateTo]
          },
          data: [{
              'text': displayText
          }],
          responseType: 'json'
      }).then(function(response){
          
          

          //writeChat(JSON.stringify(response.data, null, 4));
          //const chatInput = chatForm.querySelector("input");
          //chatInput.value = displayText;
          let myText = JSON.stringify(response.data[0], null, 4);
          let translated = JSON.parse(myText).translations;
          //let result = translatedText[0];
          //let finish = JSON.parse(result).text;
      
          console.log(myText);
          console.log(translated);

          let translatedText = JSON.stringify(translated[0], null, 4);
          let resultText = JSON.parse(translatedText).text;

          console.log(translatedText);
          console.log(resultText);
          const chatInput = chatForm.querySelector("input");
          chatInput.value = resultText;
          //console.log(result);
          //console.log(finish);

          //아직 json 타입
   
      })

    } else {
        displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
        writeChat(displayText);
        displayText = '오류: 말을 하지 않으셨거나 인식할 수 없습니다. 마이크가 제대로 작동하는지 확인하십시오.';
        writeChat(displayText);
        //마이크가 없거나 말을 안한경우
    }



}); 


}

const languagesSelect = document.querySelector("#languages");

languagesSelect.onchange = function onLanguageSelected() {
let myoption = languagesSelect.options[languagesSelect.selectedIndex].value;

switch(myoption){
  case "1" : {
    console.log("speechLanguage = "+speechLanguage+" translateFrom = "+translateFrom+" translateTo = "+translateFrom);
    speechLanguage = 'ko-KR';
    translateFrom = 'ko';
    translateTo = 'en';
    console.log("speechLanguage = "+speechLanguage+" translateFrom = "+translateFrom+" translateTo = "+translateFrom);
    break;

  }
  case "2" : {
    console.log("speechLanguage = "+speechLanguage+" translateFrom = "+translateFrom+" translateTo = "+translateFrom);
    speechLanguage = 'ko-KR';
    translateFrom = 'ko';
    translateTo = 'ko';
    console.log("speechLanguage = "+speechLanguage+" translateFrom = "+translateFrom+" translateTo = "+translateFrom);
    break;
  }
  case "3" : {
    console.log("speechLanguage = "+speechLanguage+" translateFrom = "+translateFrom+" translateTo = "+translateFrom);
    speechLanguage = 'en-US';
    translateFrom = 'en';
    translateTo = 'ko';
    console.log("speechLanguage = "+speechLanguage+" translateFrom = "+translateFrom+" translateTo = "+translateFrom);
    break;
  }
  case "4" : {
    console.log("speechLanguage = "+speechLanguage+" translateFrom = "+translateFrom+" translateTo = "+translateFrom);
    speechLanguage = 'en-US';
    translateFrom = 'en';
    translateTo = 'en';
    console.log("speechLanguage = "+speechLanguage+" translateFrom = "+translateFrom+" translateTo = "+translateFrom);
    break;
  } 
}

}

//languagesSelect.addEventListener("change",onLanguageSelected);


//버튼에 리스너 달기
startbtn.addEventListener("click", handleSpeechClick);
