const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const tokenList = {};
const User = require('./user');
const LocalStorage = require('node-localstorage');



const config = {
  "secret": "some-secret-shit-goes-here",
  // "refreshTokenSecret": "some-secret-refresh-token-shit",
  "tokenLife": 15,
  "refreshTokenLife": 20
};



//Connect
const connection = (closure) => {
  return MongoClient.connect('mongodb://Ylia:040608@ds259865.mlab.com:59865/heroesdb', (err, db) => {
    if (err) return console.log(err);
    let dbo = db.db("heroesdb");
    closure(dbo);
  });
};


router.post('/login', (req, res) => {
  connection((dbo) => {
    let userName = req.body.username;
    let password = req.body.password;
    let user = {
      "username": userName,
      "password": password
    };
    console.log("name user:" + userName + " " + "password: " + password);

    dbo.collection("users").findOne({username: userName}, function (err, user) {
      if (err) {
        return res.status(401).json({success: false, message: 'error'});
      }
      if (!user) {
        return res.status(401).json({success: false, message: 'Authorization failed! User not found.'});
      }
      if (user.password != req.body.password) {
        res.status(401).json({success: false, message: 'Authorization failed! Invalid password.'});
      } else {

        let token = jwt.sign(user, config.secret, {expiresIn: config.tokenLife});
        let refreshToken = jwt.sign(user, config.secret, {expiresIn: config.refreshTokenLife});
        const response = {
          "status": "Logged in",
          "token": token,
          "refreshToken": refreshToken,
          "user": user
        };
        tokenList[refreshToken] = userName;
        res.status(200).json(response);
        }

    })
  });
});


// delete tokens
router.post('/token', function (req, res, next) {
  let refreshToken = req.query.refreshToken;
  let token = req.query.token;
  if(refreshToken in tokenList) {
    delete tokenList[refreshToken];
  }
  res.send(204)
});


// refresh the damn token
router.post('/login/refresh', (req, res) => {
  connection((dbo) => {
    let userName = req.body.username;
    let refToken = req.body.refreshToken;
     if ( (tokenList[refToken] == userName)) {
      let user = {
        "username": userName,
        };
      let token = jwt.sign(user, config.secret, {expiresIn: config.tokenLife});
      let refreshToken = jwt.sign(user, config.secret, {expiresIn: config.refreshTokenLife});
      const response = {
        "status": "Logged in",
        "token": token,
        "refreshToken": refreshToken,
        };
      // update the token in the list
      tokenList[user.refreshToken] = userName;
      res.status(200).json(response);
    } else {
      res.status(404).send('Invalid request')
    }
  });
});


// Get heroes
router.get('/homepage', ensureAuthorized, (req, res) => {
  jwt.verify(req.token, config.secret, function (err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
    connection((dbo) => {
      dbo.collection("heroes").find({}).toArray(function (err, result) {
        if (err) {
          console.log(err);
          res.json({
            type: false,
            data: "Error: " + err
          });
        } else {
          res.json({
            type: true,
            data: data
          });
          res.send(result)

        }
      });
    });
  }
});
});


// Get heroes
router.get('/heroes',ensureAuthorized, (req, res) => {
  connection((dbo) => {
    dbo.collection("heroes").find({}).toArray(function (err, result) {
      if (err) {
        console.log(err);

        res.json({
          type: false,
          data: "Error occured: " + err
        });
       // return res.sendStatus(500)
      }
      res.send(result)
    });
  });
});


// Get heroes
router.get('/pie-chart',ensureAuthorized, (req, res) => {
  console.log("allp: " + req.query.name);
  connection((dbo) => {
    dbo.collection("heroes").find({}).toArray(function (err, result) {
      if (err) {
        console.log(err);
        return res.sendStatus(500)
      }
      res.send(result)
    });
  });
});


//get single
router.get('/heroes/:id',ensureAuthorized, (req, res) => {
  connection((dbo) => {
    let id = req.params.id;
    dbo.collection("heroes").find({'_id': new ObjectId(id)}).toArray(function (err, post) {
      if (err) {
        console.log(err);
        return res.sendStatus(500)
      }
      res.send(post)
    });
  });
});


//search hero
router.get('/searchheroes', ensureAuthorized, (req, res) => {
  console.log("search: " + req.query.name);
  connection((dbo) => {
    let query = req.query.name;
    dbo.collection("heroes").find({name: {$regex: new RegExp(query), $options: 'i'}}).toArray(function (err, result) {
      if (err) {
        console.log(err);
        return res.sendStatus(500)
      }
      res.send(result);
    });
  });
});


//Create
router.post('/heroes',ensureAuthorized, (req, res) => {
  let points = req.body.points;
  if (points < 0) {
    console.log("it's not positive number");
    res.redirect('/heroes');
  }
  else {
    let name = req.body.name;
    req.checkBody('name', 'Name is required').notEmpty().isAlphanumeric();
    let points = req.body.points;
    req.checkBody('points', 'Points is required').notEmpty().isNumeric();
    let errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      req.session.success = false;
      res.redirect('/heroes');
    }
    else {
      req.session.success = true;
      connection((dbo) => {
        let name = req.body.name;
        let type = req.body.type;
        let points = req.body.points;
        let date = req.body.date;
        let color = req.body.color;
        dbo.collection("heroes").insertOne({
          name: name,
          type: type,
          points: points,
          date: date,
          color: color
        }, function (err, post) {
          if (err) {
            console.log(err);
            return res.sendStatus(500)
          }
          res.send(post);
        });
      });
    }
    ;
  }
});


//Delete
router.delete('/heroes/:id', ensureAuthorized, (req, res) => {
  connection((dbo) => {
    let id = req.params.id;
    dbo.collection("heroes").remove({'_id': new ObjectId(id)}, function (err, post) {
      if (err) {
        console.log(err);
        return res.sendStatus(500)
      }
      res.send(post);
    });
  });
});

//Update
router.put('/heroes/:id', ensureAuthorized, (req, res) => {
  let points = req.body.points;
  if (points < 0) {
    console.log("it's not positive number");
    res.redirect('/heroes');
  }
  else {
    let name = req.body.name;
    req.checkBody('name', 'Name is required').notEmpty().isAlphanumeric();
    let points = req.body.points;
    req.checkBody('points', 'Points is required').notEmpty().isNumeric();
    let errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      req.session.success = false;
      res.redirect('/heroes');
    }
    else {
      req.session.success = true;
      connection((dbo) => {
        let id = req.params.id;
        let name = req.body.name;
        let type = req.body.type;
        let points = req.body.points;
        let date = req.body.date;
        let color = req.body.color;
        dbo.collection("heroes").updateOne({'_id': new ObjectId(id)}, {
          $set: {
            name: name,
            type: type,
            points: points,
            date: date,
            color: color
          }
        }, function (err, post) {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
          res.send(post)
        });
      });
    }
  }
});

function ensureAuthorized(req, res, next) {
  let bearerToken;
  let bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    let bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];
    req.token = bearerToken;
    next();

  } else {
    // res.send(403);
    res.status(403).send({

      "error": true,
      "message": 'Unautorization user.'
    });
  }
}

module.exports = router;
