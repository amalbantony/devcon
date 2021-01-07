"use strict";

var express = require('express');

var router = express.Router();

var auth = require('../../middleware/auth');

var Profile = require('../../models/Profile');

var _require = require('express-validator'),
    check = _require.check,
    validationResult = _require.validationResult;

var User = require('../../models/User');

router.get('/me', auth, function _callee(req, res) {
  var profile;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Profile.findOne({
            user: req.user.id
          }).populate('USER', ['name', 'avatar']));

        case 3:
          profile = _context.sent;

          if (!profile) {
            res.status(400).json({
              msg: 'No Profile found for this User'
            });
          }

          res.json(profile);
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0.message);
          res.status(500).send('Server Error');

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // post request to create or update user profile - private

router.post('/', [auth, [check('status', 'Status is required').not().isEmpty(), check('skills', 'Skills is required').not().isEmpty()]], function _callee2(req, res) {
  var errors, _req$body, company, website, location, bio, status, github_username, skills, youtube, twitter, facebook, linkedin, instagram, profileFields, profile;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _req$body = req.body, company = _req$body.company, website = _req$body.website, location = _req$body.location, bio = _req$body.bio, status = _req$body.status, github_username = _req$body.github_username, skills = _req$body.skills, youtube = _req$body.youtube, twitter = _req$body.twitter, facebook = _req$body.facebook, linkedin = _req$body.linkedin, instagram = _req$body.instagram; //build profile fields

          profileFields = {};
          profileFields.user = req.user.id;
          if (company) profileFields.company = company;
          if (website) profileFields.website = website;
          if (location) profileFields.location = location;
          if (bio) profileFields.bio = bio;
          if (github_username) profileFields.github_username = github_username;
          if (status) profileFields.status = status;

          if (skills) {
            profileFields.skills = skills.split(',').map(function (skill) {
              return skill.trim();
            });
          } //console.log(profileFields.skills)
          //res.send('HELL YEAH');
          // Build Social Fields


          profileFields.social = {};
          if (youtube) profileFields.social.youtube = youtube;
          if (twitter) profileFields.social.twitter = twitter;
          if (facebook) profileFields.social.facebook = facebook;
          if (linkedin) profileFields.social.linkedin = linkedin;
          if (instagram) profileFields.social.instagram = instagram;
          _context2.prev = 19;
          _context2.next = 22;
          return regeneratorRuntime.awrap(Profile.findOne({
            user: req.user.id
          }));

        case 22:
          profile = _context2.sent;

          if (!profile) {
            _context2.next = 28;
            break;
          }

          _context2.next = 26;
          return regeneratorRuntime.awrap(Profile.findOneAndUpdate({
            user: req.user.id
          }, {
            $set: profileFields
          }, {
            "new": true
          }));

        case 26:
          profile = _context2.sent;
          return _context2.abrupt("return", res.json(profile));

        case 28:
          // create a profile if not found
          profile = new Profile(profileFields);
          _context2.next = 31;
          return regeneratorRuntime.awrap(profile.save());

        case 31:
          res.json(profile);
          _context2.next = 38;
          break;

        case 34:
          _context2.prev = 34;
          _context2.t0 = _context2["catch"](19);
          console.error(_context2.t0.message);
          res.status(500).send('Server Error');

        case 38:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[19, 34]]);
});
module.exports = router;