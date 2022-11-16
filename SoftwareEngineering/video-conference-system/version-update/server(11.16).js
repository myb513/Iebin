import express from "express";
import SocketIO from "socket.io";
import http from "http";
import bodyParser from "body-parser";

//11월 16일 추가사항 
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const passport = require('passport')
,GoogleStrategy = require('passport-google-oauth').OAuth2Strategy



const PORT = process.env.PORT || 4000;

const app = express();


// 11월 16일 추가사항  (~165line)
//기본 회원정보 (웹 실무시 데이터 베이스로 대체 하면됨)
let db = [{
	id : '1',
	email : 'goodmemory@tistory.com',
    password : 'goodmemory',
    name : 'goodmemory',
    provider : '',
    token : '',
    providerId : ''
}];

//구글 api ID, Secret 정보 저장 (구글 개발자 웹 내 앱ID, 시크릿 입력)
const googleCredentials = {
    "web": {
        "client_id": "832440413694-15midan99opv19j7nrocr79dndcnplg8.apps.googleusercontent.com",
        "client_secret": "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",
        "redirect_uris": [
            "http://localhost:4000/login/callback"
        ]
    }
}


//MIDDLEWARE
app.use(express.urlencoded({extended : false}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store : new fileStore()
}));

//PASSPORT - 전용 middleware 추가
app.use(passport.initialize());
app.use(passport.session());

//PASSPORT - 직렬화 
//serializeUser : 로그인 / 회원가입 후 1회 실행
//deserializeUser : 페이지 전환시 마다 실행 
passport.serializeUser(function(user, done) {
    done(null, user);
  });
passport.deserializeUser(function(user, done) {
	done(null, user);
});


//PASSPORT (Google) - 구글 로그인시 정보 GET
passport.use(new GoogleStrategy({
    clientID: googleCredentials.web.client_id,
    clientSecret: googleCredentials.web.client_secret,
    callbackURL: googleCredentials.web.redirect_uris[0]
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile);
       let user = db.find(userInfo => userInfo.email === profile.emails[0].value);
       if(user) {
           user.provider = profile.provider;
           user.providerId = profile.id;
           user.token = accessToken;
           user.name = profile.displayName;
       }else {
           user = {
               id : 2,  //랜덤값 필요시, npm shortid 설치 후 shortid.generate() 활용
               provider : profile.provider,
               providerId : profile.id,
               token : accessToken,
               name : profile.displayName,
               email : profile.emails[0].value
           }
           db.push(user);
       }
         return done(null, user);
  }
));

//구글 로그인 버튼 클릭시 구글 페이지로 이동하는 역할
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));


//구글 로그인 후 자신의 웹사이트로 돌아오게될 주소 (콜백 url)
app.get('/login/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
    res.redirect('/');
  });

//홈페이지 생성 (req.user는 passport의 serialize를 통해 user 정보 저장되어있음)
app.get('/',(req,res)=>{
	const temp = getPage('Welcome', 'Welcome to visit...',getBtn(req.user));
    res.send(temp);
});

//로그아웃 페이지 : 로그 아웃 처리 + 세션 삭제 + 쿠키 삭제 후 홈으로 리다이렉션
//passport 패키지로 인해 req.logout()으로 로그아웃 기능 구현 가능
app.get('/auth/logout',(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err) next(err);
        req.logOut();
        res.cookie(`connect.sid`,``,{maxAge:0});
        res.redirect('/');
    });
});

//에러처리
app.use((err,req,res,next)=>{
  if(err) console.log(err);
  res.send(err);
});

//로그인 or 로그아웃 상태에 따른 버튼 생성
const getBtn = (user) =>{
    return user !== undefined ? `${user.email} | <a href="/auth/logout">logout</a>` : `<a href="/auth/google">Google Login</a>`;
}

//페이지 생성 함수
const getPage = (title, description,auth)=>{
	return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
        </head>
        <body>
            ${auth}
            <h1>${title}</h1>
            <p>${description}</p>
        </body>
        </html>
        `;
}


// app.get("/", (req, res) => {
//   res.render("home");
// });

app.get("/chat/:roomName/:nickName", (req, res) => {
  res.render("home", { invite: "1", iroomName: req.params.roomName, inickName: req.params.nickName });
})

app.get("/*", (req, res) => {
  res.redirect("/");
});



const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

let roomObjArr = [];
const MAXIMUM = 5;

wsServer.on("connection", (socket) => {
  let myRoomName = null;
  let myNickname = null;


  socket.on("join_room", (roomName, nickname) => {
    myRoomName = roomName;
    myNickname = nickname;

    let isRoomExist = false;
    let targetRoomObj = null;

    // forEach를 사용하지 않는 이유: callback함수를 사용하기 때문에 return이 효용없음.
    for (let i = 0; i < roomObjArr.length; ++i) {
      if (roomObjArr[i].roomName === roomName) {
        // Reject join the room
        if (roomObjArr[i].currentNum >= MAXIMUM) {
          socket.emit("reject_join");
          return;
        }

        isRoomExist = true;
        targetRoomObj = roomObjArr[i];
        break;
      }
    }

    // Create room
    if (!isRoomExist) {
      targetRoomObj = {
        roomName,
        currentNum: 0,
        users: [],
      };
      roomObjArr.push(targetRoomObj);
    }

    //Join the room
    targetRoomObj.users.push({
      socketId: socket.id,
      nickname,
    });
    ++targetRoomObj.currentNum;

    socket.join(roomName);
    socket.emit("accept_join", targetRoomObj.users);
  });

  socket.on("offer", (offer, remoteSocketId, localNickname) => {
    socket.to(remoteSocketId).emit("offer", offer, socket.id, localNickname);
  });

  socket.on("answer", (answer, remoteSocketId) => {
    socket.to(remoteSocketId).emit("answer", answer, socket.id);
  });

  socket.on("ice", (ice, remoteSocketId) => {
    socket.to(remoteSocketId).emit("ice", ice, socket.id);
  });

  socket.on("chat", (message, roomName) => {
    socket.to(roomName).emit("chat", message);
  });

  socket.on("email", (message, user) => {
    socket.to(user !== undefined ? `${user.email}` : `비회원`).emit("chat", message);
  });

  socket.on("disconnecting", () => {
    socket.to(myRoomName).emit("leave_room", socket.id, myNickname);

    let isRoomEmpty = false;
    for (let i = 0; i < roomObjArr.length; ++i) {
      if (roomObjArr[i].roomName === myRoomName) {
        const newUsers = roomObjArr[i].users.filter(
          (user) => user.socketId != socket.id
        );
        roomObjArr[i].users = newUsers;
        --roomObjArr[i].currentNum;

        if (roomObjArr[i].currentNum == 0) {
          isRoomEmpty = true;
        }
      }
    }

    // Delete room
    if (isRoomEmpty) {
      const newRoomObjArr = roomObjArr.filter(
        (roomObj) => roomObj.currentNum != 0
      );
      roomObjArr = newRoomObjArr;
    }
  });
});

const handleListen = () =>
  console.log(`✅ Listening on https://localhost:${PORT}`);
httpServer.listen(PORT, handleListen);
