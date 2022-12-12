const queries = require('./queries');
const db = require('../db/index');
const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
    res.json({ info: 'Node.js, Express, and Postgres API for HotGuyPropBets' });
})


//Get all users
router.get('/users', queries.getAllUsers);

//Add user to data base
router.post('/users', queries.addUser);

module.exports = router;