const User = require('../models/users');
const Notification = require('../models/Notification')
const passport = require('passport');
const fs = require('fs')
const path = require('path')

const appDir = path.dirname(require.main.filename);

exports.register = function (req, res) {
  const name = req.fields.name
  const address = req.fields.address
  const email = req.fields.email
  const phone = req.fields.phone
  const password = req.fields.password
  const status = false
  const imageUpload = req.files.image;
  let image = imageUpload.name
  image = +new Date() + "_" + image;
  const oldPath = imageUpload.path;
  const newPath = `./uploads/users/${image}`;
  const rawData = fs.readFileSync(oldPath);

  fs.writeFile(newPath, rawData, (error) => {
    if (error) res.status(500).send(error);
  });

  const user = new User({
    name: name,
    address: address,
    email: email,
    phone: phone,
    password: password,
    status: status,
    image: image
  });

  return user.save((errors, savedUser) => {
    if (errors) {
      return res.status(422).json({ errors })
    }
    if (savedUser) {
      return res.json({ success: true })
    }
  })
}


exports.login = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }, function (err, user) {
    if (!user) {
      return res.status(422).send({ userNotFound: true })
    }
    let status = user.status
    console.log(status);
    if (status == true) {
      return passport.authenticate('local', (err, passportUser) => {
        if (err) {
          return next(err)
        }

        if (passportUser) {
          return res.json(passportUser.toAuthJSON())

        } else {
          return res.status(422).send({
            errors: {
              'message': 'Login or Password is Incorrect'
            }
          })
        }

      })(req, res, next)
    } else {
      return res.status(200).json({ inProcess: true });
    }
  })
}
exports.getCurrentUser = function (req, res, next) {
  const user = req.user;
  console.log(user);
  if (!user) {
    return res.sendStatus(422);
  }
  // return res.json(user);
  return res.json(user.toAuthJSON());
};

exports.checkEmail = function (req, res, next) {
  const email = req.params.email;
  console.log(email);
  User.findOne({ email: email }, (error, user) => {
    if (user) {
      res.status(200).json(false);
    } else {
      res.status(200).json(true);
    }
  })
}

exports.getVerifiedUsers = function (req, res) {
  User.find({ status: true })
    .then(users => {
      res.json(users);
    })
}


exports.getUnVerifiedUsers = function (req, res) {
  User.find({ status: false })
    .then(users => {
      res.json(users);
    })
}


exports.markVerified = function (req, res) {
  const id = req.params.id;
  User.findByIdAndUpdate(id, {
    $set: { status: true}}, {upsert:true}, function (error, user) {
      if (error) res.status(500).send(error);
      if (user) {
        return res.status(200).json({ success: true });
      }
  }
  )
}
exports.markUnVerified = function (req, res) {
  const id = req.params.id;
  User.findByIdAndUpdate(id, {
    $set: { status: false}}, {upsert:true}, function (error, user) {
      if (error) res.status(500).send(error);
      if (user) {
        return res.status(200).json({ success: true });
      }
  }
  )
}

exports.userById = function (req, res) {
  const id = req.params.id;
  User.findOne({ _id: id })
    .then(user => {
      res.json(user);
    })
}
exports.getAllUsersForMessages = function (req, res) {
  const id = req.params.id
  User.find({_id: { $nin: id }})
    .then(users => {
      res.json(users);
    })
},

exports.registerMessage = function (req, res) {
  const senderId = req.params.id
  const message = req.body.message
  let users = req.body.selectedUsers
if (users.length > 1) {
  users.forEach(user => {
    const notification = new Notification({
    message: message,
    user: user._id,
    sender: senderId
  });
  notification.save()
})
return res.status(200).json({ success: true });
}else {
  const notification = new Notification({
    message: message,
    user: users,
    sender: senderId
  });
  notification.save()
  return res.status(200).json({ success: true });
}

}

exports.getUserMessages = function (req, res) {
  const userId = req.params.id
  Notification.find({user: userId})
  .populate('user')
  .populate('sender')
  .then(messages => {
    res.json(messages);
  })

}
