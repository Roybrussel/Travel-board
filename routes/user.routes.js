const express = require('express');
const router = express.Router();

const Travelboard = require('../models/Travelboard.model');
const User = require('../models/User.model');

router.get('/profile', (req, res, next) =>
  res.render('user/user-profile', {
    userInSession: req.session.currentUser || null,
  })
);

router.get('/edit-profile/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('user/edit-user-profile', {
    userInSession: req.session.currentUser,
  });
});

router.post('/edit-profile/:id', (req, res, next) => {
  const { id } = req.params;

  const {
    firstName,
    lastName,
    about,
    favoriteDestination,
    profilePictureUrl,
  } = req.body;

  User.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      about,
      favoriteDestination,
      profilePictureUrl,
    },
    { new: true }
  )
    .then(() => {
      res.redirect('/profile');
    })
    .catch((error) => next(error));
});

router.get('/add-travel-board/:userid', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('add-travel-board', {
    userInSession: req.session.currentUser,
  });
});

router.post('/add-travel-board/:userid', (req, res, next) => {
  const { userid } = req.params;
  const { country, experienceInput, travelBoardPictureUrl } = req.body;

  Travelboard.create({
    user: userid,
    country,
    experienceInput,
    travelBoardPictureUrl,
  })
    .then((newBoard) =>
      User.findByIdAndUpdate(userid, { $push: { travelBoards: newBoard._id } })
    )
    .then(() => res.redirect('/profile'))
    .catch((error) => `Error while creating a new Travel Board: ${error}`);
});

module.exports = router;
