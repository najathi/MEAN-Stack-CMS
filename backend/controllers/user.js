const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const hashedPw = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    password: hashedPw
  });
  user.save()
    .then(result => {
      res.status(201).json({
        message: 'User Created!',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({message: 'Invalid authentication credentials!'});
    });
};

exports.login = (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      }
      // create web token
      const token = jwt.sign({
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        process.env.JWT_KEY,
        {expiresIn: '1h'}
      );
      //jwt.sign() method creates a new token based on some input data of your choice.
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}
