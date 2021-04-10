const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

if (process.env.NODE_ENV !== "production") {
  // Load environment variables from .env file in non prod environments
  require("dotenv").config();
}

require("./utils/connectdb");

const Token = require("./models/token");

const app = express();
app.use(bodyParser.json());

// Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", function (req, res) {
  res.send({ status: "success" });
});

app.post("/push_notification", function (req, res) {
  res.send({ status: "success" });
});
app.post("/save_token", function (req, res) {
  const token = req.body.token;

  if (token) {
    Token.find({ tokenValue: token }, (err, existingToken) => {
      if (err) {
        res.statusCode = 500;
        res.send(err);
      }
      if (!err && existingToken.length === 0) {
        const newToken = new Token({ tokenValue: req.body.token });

        newToken.save(function (err, savedToken) {
          if (err) {
            res.statusCode = 500;
            res.send(err);
          }

          res.send({ status: "success" });
        });
      } else {
        res.send({ status: "success" });
      }
    });
  } else {
    res.statusCode = 400;
    res.send({ message: "token not passed!" });
  }
});

// Start the server in port 8081
const server = app.listen(process.env.PORT || 8081, function () {
  const port = server.address().port;
  console.log("App started at port:", port);
});
