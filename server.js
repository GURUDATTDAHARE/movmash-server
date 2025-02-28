const http = require("http");
const express = require("express");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require("swagger-ui-express");
const {
  addUser,
  removeUser,
  getUserDetail,
  getUsersInRoom,
  getHostDetail,
} = require("./util/userManagement");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
// const { ExpressPeerServer } = require("peer");
// const customGenerationFunction = () =>
//   (Math.random().toString(36) + "0000000000000000000").substr(2, 16);
// const peerServer = ExpressPeerServer(server, {
//   debug: true,
//   key: "peerjs",
//   path: "/",
//   generateClientId: customGenerationFunction,
// });
require("dotenv").config();
// const requests = require("./requests.js");
// const axios = require("./axios.js");
const LiveShow = require("./models/liveShowModel");
const Conversation = require("./models/conversationModel");
const Notification = require("./models/notificationModel");
const Room = require("./models/roomModel");
const {
  signup,
  login,
  getUserDetails,
  followUser,
  unfollowUser,
  getFollowersDetails,
  getFollowingsDetails,
  updateUserDetails,
  getUser,
  getMashUserDetails,
} = require("./routes/userRoutes.js");
const mashDBAuth = require("./util/mashDBAuth.js");
const {
  postOnePosts,
  likePost,
  unlikePost,
  deletePost,
  getSubscribedPost,
  getMyPost,
  postComment,
  deleteComment,
  likeComment,
  unlikeComment,
  getPostComments,
  getMashUserPost,
  sendBookingRequest,
  getRequestedTicket,
  cancelRequestedTicket,
  markRequestedTicketConfirmed,
} = require("./routes/postRoutes.js");
const {
  markNotificationRead,
  getAllNotifications,
} = require("./routes/notificationRoutes.js");
const {
  likeMovie,
  dislikeMovie,
  undoLikeMovie,
  undoDislikeMovie,
  searchMovie,
  upcomingCovers,
  movieLists,
  getMovieDetail,
  checkMovieStatus,
  addToWatchlist,
  removeFromWatchlist,
  createNewList,
  getUserList,
  getMashUserList,
  deleteList,
  updateList,
  getUserWatchList,
  getMashUserWatchList,
  getUserLikeDislikeMovielist,
  getMashUserLikeDislikeMovielist,
} = require("./routes/movieRoutes.js");
const {
  postUserReview,
  movieRatedStatus,
} = require("./routes/reviewRoutes.js");
const {
  getAllUserRooms,
  getRoomsMessages,
  getUnreadRooms,
  markChatRoomRead,
  createChatRoom,
} = require("./routes/chatRoutes.js");
const {
  getLiveShowDetails,
  createLiveShow,
  getAllLiveShow,
  getGenreLiveShow,
  getFollowingsLiveShow,
} = require("./routes/liveShowRoutes");
const {
  getUserRecommendation,
  getExplorePosts,
} = require("./routes/exploreRoutes");
const {
  searchUser,
  searchTicket,
  searchList,
} = require("./routes/searchRoutes");
const chalk = require("chalk");
//.....................................[swagger option]...............................
const swaggerOption = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Movmash API",
      version: "1.0.0",
      description:
        "Welcome to the Movmash API documentation. Please go through all the doc mention below.",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./documentation/*"],
  servers: ["http://localhost:8000"],
};
const swaggerDocs = swaggerJsDoc(swaggerOption);
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocs));
//....................................................................................
// app.use("/peerjs", peerServer);
app.use(cors((origin = "http://localhost:3000"), (optionsSuccessStatus = 200)));
app.use(express.json());

//....................................................................................

const db = mongoose.connection;
// db.once("open", () => {
//   console.log("mashDB is now connected");
//   require("./triggers/triggers");
// });

//....................................................................................
app.get("/api/v1/movie/search-movie", searchMovie);

app.get("/api/v1/movie/upcoming-cover", upcomingCovers);

app.get("/api/v1/movie/genre/:genreName/:pageNumber", movieLists);

app.get("/api/v1/movie/details/:movieId", getMovieDetail);
//....................................................................................

app.post("/api/v1/home/signup", signup);
app.post("/api/v1/home/login", login);
app.get("/api/v1/home/user/:id", mashDBAuth, getUserDetails);
app.put("/api/v1/home/user/follow", mashDBAuth, followUser);
app.put("/api/v1/home/user/unfollow", mashDBAuth, unfollowUser);
app.get("/api/v1/home/get-followers", mashDBAuth, getFollowersDetails);
app.get("/api/v1/home/get-followings", mashDBAuth, getFollowingsDetails);
app.put("/api/v1/home/update-user-details", mashDBAuth, updateUserDetails);
app.get("/api/v1/home/get-user", mashDBAuth, getUser);
app.get(
  "/api/v1/home/mash-user-details/:userName",
  mashDBAuth,
  getMashUserDetails
);
//...........................................................................................
app.get("/api/v1/home/get-notification", mashDBAuth, getAllNotifications);
app.put(
  "/api/v1/home/user/read-notification",
  mashDBAuth,
  markNotificationRead
);
//.......................................................................
app.get("/api/v1/home/getSubPost", mashDBAuth, getSubscribedPost);
app.post("/api/v1/home/post", mashDBAuth, postOnePosts);
app.put("/api/v1/home/like-post", mashDBAuth, likePost);
app.put("/api/v1/home/unlike-post", mashDBAuth, unlikePost);
app.delete("/api/v1/home/delete-post/:postId", mashDBAuth, deletePost);
// app.get("/api/v1/home/getSubPost", mashDBAuth, getSubscribedPost);
app.get("/api/v1/home/myPost", mashDBAuth, getMyPost);
app.post("/api/v1/home/comment-post", mashDBAuth, postComment);
app.delete("/api/v1/home/delete-comment/:commentId", mashDBAuth, deleteComment);
app.put("/api/v1/home/like-comment", mashDBAuth, likeComment);
app.put("/api/v1/home/unlike-comment", mashDBAuth, unlikeComment);
app.get("/api/v1/home/get-post-comment", mashDBAuth, getPostComments);
app.get("/api/v1/home/mash-user-post/:userName", mashDBAuth, getMashUserPost);
//...........................................................................................
app.get(
  "/api/v1/movie/get-user-like-dislike-movielist",
  mashDBAuth,
  getUserLikeDislikeMovielist
);
app.get(
  "/api/v1/movie/get-mash-user-like-dislike-movielist/:userName",
  mashDBAuth,
  getMashUserLikeDislikeMovielist
);
app.post("/api/v1/movie/like-movie", mashDBAuth, likeMovie);
app.post("/api/v1/movie/dislike-movie", mashDBAuth, dislikeMovie);
app.post("/api/v1/movie/undo-like-movie", mashDBAuth, undoLikeMovie);
app.post("/api/v1/movie/undo-dislike-movie", mashDBAuth, undoDislikeMovie);
app.get("/api/v1/movie/movie-status/:id", mashDBAuth, checkMovieStatus);
//..
app.get("/api/v1/movie/get-user-list", mashDBAuth, getUserList);
app.get(
  "/api/v1/movie/get-mash-user-list/:userName",
  mashDBAuth,
  getMashUserList
);
//..
app.get("/api/v1/movie/get-user-watchList", mashDBAuth, getUserWatchList);
app.get(
  "/api/v1/movie/get-mash-user-watchlist/:userName",
  mashDBAuth,
  getMashUserWatchList
);
//...
app.put("/api/v1/movie/update-list", mashDBAuth, updateList);
app.delete("/api/v1/movie/delete-list/:listId", mashDBAuth, deleteList);
app.post("/api/v1/movie/create-new-list", mashDBAuth, createNewList);
app.post("/api/v1/movie/add-to-watchlist", mashDBAuth, addToWatchlist);
app.post(
  "/api/v1/movie/remove-from-watchlist",
  mashDBAuth,
  removeFromWatchlist
);
app.get(
  "/api/v1/movie/movie-rated-status/:movieId",
  mashDBAuth,
  movieRatedStatus
);
app.post("/api/v1/movie/post-user-review", mashDBAuth, postUserReview);
//....
app.post("/api/v1/home/create-chat-room", mashDBAuth, createChatRoom);
app.get("/api/v1/home/get-user-rooms", mashDBAuth, getAllUserRooms);
app.get("/api/v1/home/get-unread-rooms", mashDBAuth, getUnreadRooms);
app.get(
  "/api/v1/home/get-rooms-messages/:roomId",
  mashDBAuth,
  getRoomsMessages
);
app.put("/api/v1/home/mark-chatRoom-read", mashDBAuth, markChatRoomRead);
//..................

app.post("/api/v1/live/create-live-show", mashDBAuth, createLiveShow);

app.get(
  "/api/v1/live/get-live-show-details/:roomCode",
  mashDBAuth,
  getLiveShowDetails
);
app.get(
  "/api/v1/live/get-genre-live-show/:genre",
  mashDBAuth,
  getGenreLiveShow
);
app.get("/api/v1/live/get-all-live-show", mashDBAuth, getAllLiveShow);
app.get(
  "/api/v1/live/get-followings-live-show",
  mashDBAuth,
  getFollowingsLiveShow
);
//...

app.get(
  "/api/v1/explore/get-user-recommendation",
  mashDBAuth,
  getUserRecommendation
);
app.get("/api/v1/explore/get-explore-post", mashDBAuth, getExplorePosts);

//......
app.get("/api/v1/search-list", mashDBAuth, searchList);
app.get("/api/v1/search-user", mashDBAuth, searchUser);
app.get("/api/v1/search-ticket", mashDBAuth, searchTicket);
//............................................ ticket booking management .................
app.post(
  "/api/v1/bookingTicket/send-booking-request",
  mashDBAuth,
  sendBookingRequest
);
app.get(
  "/api/v1/bookingTicket/get-requested-ticket",
  mashDBAuth,
  getRequestedTicket
);
app.delete(
  "/api/v1/bookingTicket/cancel-requested-ticket/:postId",
  mashDBAuth,
  cancelRequestedTicket
);
app.put(
  "/api/v1/bookingTicket/mark-ticket-confirm",
  mashDBAuth,
  markRequestedTicketConfirmed
);
//.................................... web sockets .........................................

db.once("open", () => {
  console.log(chalk.hex("#fab95b").bold("🚀 Change stream activated 📗"));
  require("./triggers/triggers");

  ///...................................
  const notification = db.collection("notifications");
  const changeStreamForNotification = notification.watch();
  changeStreamForNotification.on("change", (change) => {
    console.log("heyyy");
    // console.log("change in server", change);
    if (change.operationType === "insert") {
      Notification.findById(change.fullDocument._id)
        .populate("senderId", "profileImageUrl userName fullName")
        .then((doc) => {
          return io
            .to(change.fullDocument.recipientId.toString())
            .emit("notification", doc);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });
});
const users = {};

const socketToRoom = {};
io.on("connection", (socket) => {
  console.log(socket.handshake.query.id);
  socket.join(socket.handshake.query.id);

  console.log("new connection have build");

  socket.on("sendMessage", (message) => {
    console.log(message);
    try {
      let chat = new Conversation(message);

      chat.save((err, doc) => {
        if (err) return console.log(err);

        Conversation.find({ _id: doc._id })
          .populate("sender", "userName profileImageUrl fullName")
          .populate("recipient", "userName profileImageUrl fullName")
          .then((doc) => {
            Room.findByIdAndUpdate(
              message.roomId,
              { lastMessage: doc[0] },
              { new: true }
            )
              .populate("participants", "profileImageUrl userName fullName")
              .then((data) => {
                console.log(message.roomId);
                io.to(message.sender)
                  .to(message.recipient)
                  .emit("message-room", data);
                return io
                  .to(message.sender)
                  .to(message.recipient)
                  .emit("message", doc);
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => {
            console.log(e);
          });
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("join-party", ({ roomCode, userName, userId }) => {
    console.log(roomCode, userName);
    LiveShow.findOneAndUpdate(
      { roomCode },
      { $inc: { memberNumber: 1 } },
      { new: true }
    )
      .then((data) => {
        console.log(data, 1);
        if (data === null) {
          socket.emit("room-not-found");
          return;
        }
        const { user } = addUser({
          id: socket.id,
          room: roomCode,
          name: userName,
          host: userId === data.host.toString(),
        });
        socket.join(user.room);
        socket.emit("party-message", {
          user: "admin",
          text: `welcome, ${user.name} !!!`,
          type: "greet",
        });
        socket.broadcast.to(user.room).emit("party-message", {
          user: "admin",
          text: `${user.name} has joined!`,
          type: "greet",
        });
        let host = null;
        if (userId === data.host.toString()) {
          host = socket.id;
          socket.emit("set-host");
          socket.broadcast.to(roomCode).emit("host-enter-in-room");
        } else {
          // can check if host is not available the emit something .....................................................................................................................
          console.log(getHostDetail(roomCode));
          if (getHostDetail(roomCode) === undefined) {
            socket.emit("no-host-available");
          } else {
            host = getHostDetail(roomCode).id;
            console.log(host);
          }
        }
        const userList = getUsersInRoom(roomCode);
        io.to(roomCode).emit("user-list-inside-the-room", userList);
        if (socket.id !== host) {
          console.log("call the host " + host);
          setTimeout(() => {
            socket.broadcast.to(host).emit("get-data", { caller: socket.id });
          }, 2000);
        } else {
          console.log("I am the host");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
  socket.on("send-party-message", ({ roomCode, userName, message }) => {
    console.log(socket.id);
    const user = getUserDetail(socket.id);

    io.to(user.room).emit("party-message", {
      user: user.name,
      text: message,
      type: "user",
    });
  });

  //...........................................
  socket.on("play-video", (data) => {
    var roomnum = data.room;
    console.log("1");

    socket.broadcast.to(roomnum).emit("play-video-client");
  });

  socket.on("play-other", (data) => {
    var roomnum = data.roomCode;
    console.log("2");
    console.log(roomnum);
    socket.broadcast.to(roomnum).emit("just-play");
  });
  socket.on("pause-other", (data) => {
    var roomnum = data.roomCode;
    console.log("3");
    console.log(roomnum);
    socket.broadcast.to(roomnum).emit("just-pause");
  });
  socket.on("seek-other", (data) => {
    var roomnum = data.roomCode;
    var currTime = data.time;
    // var state = data.state;
    console.log("4");
    socket.broadcast.to(roomnum).emit("just-seek", {
      time: currTime,
      // state: state
    });
  });
  socket.on("sync-video", (data) => {
    var roomnum = data.roomCode;
    var currTime = data.time;
    var state = data.state;
    console.log("4");
    socket.broadcast.to(roomnum).emit("sync-video-client", {
      time: currTime,
      state: state,
    });
  });
  //.........................
  socket.on("sync-the-host", (data) => {
    console.log("hello");
    console.log(data);
    socket.broadcast.to(data.caller).emit("sync-the-video-with-host", {
      time: data.time,
      state: data.state,
    });
  });
  socket.on("sync-the-host-button", (data) => {
    console.log("hello");
    socket.broadcast.to(data.roomCode).emit("sync-the-video-with-host-button", {
      time: data.time,
      state: data.state,
    });
  });
  //........................
  socket.on("sync-host", (data) => {
    if (getHostDetail(data.roomCode) !== undefined) {
      console.log("sync-host");
      // var host = io.sockets.adapter.rooms[socket.roomnum].host;
      let host = getHostDetail(data.roomCode).id;
      // console.log(host)
      if (socket.id !== host) {
        console.log("is host");
        socket.broadcast.to(host).emit("get-data", { caller: socket.id });
      } else {
        console.log("not host");
        socket.emit("sync-host-server");
      }
    }
  });
  socket.on("get-host-data", (data) => {
    if (getHostDetail(data.roomCode) !== undefined) {
      // var roomnum = data.room;
      // var host = io.sockets.adapter.rooms[roomnum].host;
      let host = getHostDetail(data.roomCode);
      if (data.currTime === undefined) {
        let caller = socket.id;
        socket.broadcast.to(host).emit("get-player-data", {
          room: data.roomCode,
          caller: caller,
        });
      } else {
        var caller = data.caller;

        socket.broadcast.to(caller).emit("compareHost", data);
      }
    }
  });
  socket.on("change host", (data) => {
    if (io.sockets.adapter.rooms[socket.roomnum] !== undefined) {
      var roomnum = data.room;
      var newHost = socket.id;
      var currHost = io.sockets.adapter.rooms[socket.roomnum].host;

      if (newHost !== currHost) {
        socket.broadcast.to(currHost).emit("unSetHost");

        io.sockets.adapter.rooms[socket.roomnum].host = newHost;

        socket.emit("set-host");

        // io.sockets.adapter.rooms[socket.roomnum].hostName = socket
      }
    }
  });
  //.....get user in the room ...........................
  // socket.on("join-video-chat-room", (roomCode, id) => {
  //   socket.join(roomCode);
  //   console.log(id, roomCode);
  //   io.to(roomCode).emit("user-connected-to-video-chat", id);
  // });
  socket.on("get-user-in-the-room", (data) => {
    const userList = getUsersInRoom(data.roomId);
    console.log(data);
    socket.emit("user-list-inside-the-room", userList);
  });
  socket.on("sending-signal", (payload) => {
    socket.broadcast.to(payload.userToSignal).emit("user-joined-video-chat", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
    console.log("sending singnal");
  });
  socket.on("returning-signal", (payload) => {
    socket.broadcast.to(payload.callerID).emit("receiving-returned-signal", {
      signal: payload.signal,
      id: socket.id,
    });
    console.log("returning singnal");
  });
  //............//.....//....................

  socket.on("join room", (roomID) => {
    const userList = getUsersInRoom(roomID);
    console.log(roomID);
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    console.log(users);
    console.log(userList);
    socketToRoom[socket.id] = roomID;
    // const usersInThisRoom = userList.filter((user) => user.id !== socket.id);

    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);
    console.log(usersInThisRoom, 23);
    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    console.log("sending signal");
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    console.log("returning signal");
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });
  //.............//...........//..............
  //......................................................
  socket.on("leaving-party", () => {
    console.log("leaving-party");
    const userDetail = getUserDetail(socket.id);

    if (userDetail !== undefined) {
      if (userDetail.host) {
        socket.broadcast.to(userDetail.room).emit("no-host-available");
      }
      LiveShow.findOneAndUpdate(
        { roomCode: userDetail.room },
        { $inc: { memberNumber: -1 } },
        { new: true }
      )
        .then((data) => {
          const user = removeUser(socket.id);
          console.log(data);
          if (users[userDetail.room]) {
            const indexVideo = users[userDetail.room].filter(
              (u) => u === socket.id
            );
            if (indexVideo !== -1)
              users[userDetail.room].splice(indexVideo, 1)[0];
          }

          if (user) {
            socket.broadcast.to(user.room).emit("party-message", {
              user: "admin",
              text: `${user.name} has left`,
              type: "greet",
            });
            const userList = getUsersInRoom(user.room);
            console.log(userList, "leaving");
            io.to(user.room).emit("user-list-inside-the-room", userList);
            io.to(user.room).emit("close-peer");
            console.log("closePeer");
            socket.leave(user.room);
            // io.to(user.room).emit("party-message", {
            //   user: "admin",
            //   text: `${user.name} has left`,
            //   type: "greet",
            // });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });
  //......................................

  //...........................................
  socket.on("disconnect", () => {
    console.log("disconnected user");
    const userDetail = getUserDetail(socket.id);
    if (userDetail !== undefined) {
      if (userDetail.host) {
        socket.broadcast.to(userDetail.room).emit("no-host-available");
      }
      LiveShow.findOneAndUpdate(
        { roomCode: userDetail.room },
        { $inc: { memberNumber: -1 } },
        { new: true }
      )
        .then((data) => {
          const user = removeUser(socket.id);
          console.log(data);
          if (users[userDetail.room]) {
            const indexVideo = users[userDetail.room].filter(
              (u) => u === socket.id
            );
            if (indexVideo !== -1)
              users[userDetail.room].splice(indexVideo, 1)[0];
          }
          if (user) {
            io.to(user.room).emit("party-message", {
              user: "admin",
              text: `${user.name} has left`,
              type: "greet",
            });
            const userList = getUsersInRoom(user.room);
            io.to(user.room).emit("user-list-inside-the-room", userList);
            io.to(user.room).emit("close-peer");
            console.log("closePeer");
            socket.leave(user.room);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });
});
const port = process.env.PORT || 8000;
app.set("socketio", io);
//......................................[Server database connection].......................
mongoose
  .connect(process.env.DB_URI, {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(port, () => {
      console.log(
        chalk.hex("#fab95b").bold(`🚀 Server ready at http://localhost:${port} 📗`)
      );
      console.log( chalk.hex("#fab95b").bold("🚀 MashDB is now connected 📗"));
    });
  })
  .catch((e) => console.log(e));

