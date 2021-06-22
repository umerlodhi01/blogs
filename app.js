const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/dev')
// const path = require("path");
const session = require('express-session');
const passport = require('passport');
const morgan = require("morgan");
// const cors = require('cors')

mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('DB Connected!'))
    .catch(err => console.log(err));

require("./services/passport");
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server, {pingTimeout: 60000})
require('./socket')(io)


app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());

// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));


// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     if (req.method === "OPTIONS") {
//       res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//       return res.status(200).json({});
//     }
//     next();
//   });
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});


const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');


app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/posts', postsRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
    console.log('App is running on port: ' + PORT);
});