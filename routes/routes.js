const queries = require('./queries');
const db = require('../db/index');
const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
    res.json({ info: 'Node.js, Express, and Postgres API for HotGuyPropBets' });
})


//Get all users
router.get('/users', queries.getAllUsers);

//Get all user payment info
router.get('/paymentinfo', queries.getUsersPaymentInfo);

//Get specific users question answers
router.get('/answers/:id', queries.getUserQuestionAnswers);

//Add user to data base
router.post('/users', queries.addUser, queries.addUserAnswers, queries.addUserPaymentInfo);

module.exports = router;