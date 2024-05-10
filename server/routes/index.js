const express = require('express');

const registerUser = require('../controller/register-user');
const checkEmail = require('../controller/check-email');
const checkPassword = require('../controller/check-password');
const userDetails = require('../controller/user-details');
const logout = require('../controller/logout');
const updateUserDetails = require('../controller/update-user-details');

const router = express.Router();

router.post('/register', registerUser);

router.post('/email', checkEmail);

router.post('/password', checkPassword);

router.get('/user-details', userDetails);

router.get('/logout', logout);

router.post('/update-user', updateUserDetails);

module.exports = router;
