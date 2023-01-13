const queries = require('./queries');
const db = require('../db/index');
const express = require('express');
const router = express.Router();


router.get("/", (req, res, next) => {
    res.json({ info: 'Node.js, Express, and Postgres API for HotGuyPropBets' });
})

//Listens for updates to final answers and updates scores
db.prodListener.connect(() => console.log('Database connected!'));
db.prodListener.query('LISTEN answer_update');
db.prodListener.on('notification', () => {
    console.log('Database question updated...')
    queries.updatePayout()
});

//Get all users
router.get('/users', queries.getAllUsers);

//Get all user payment info
router.get('/paymentinfo', queries.getUsersPaymentInfo);

//Get game info
router.get('/gameinfo', queries.getGameInfo);

//Get specific users question answers
router.get('/answers/:id', queries.getUserQuestionAnswers);

//Get questions
router.get('/questions', queries.getQuestions);

//Add user to data base
//Uses all middleware
//router.post('/users', queries.addUser, queries.addUserAnswers, queries.addUserPaymentInfo, queries.updateScores, queries.updateUserScore, queries.setPot, queries.setPayOut);
//Uses shell function for score updates
//router.post('/users', queries.addUser, queries.addUserAnswers, queries.addUserPaymentInfo, queries.updateScores);
//Reduced query approach
router.post('/users', queries.addUser, queries.setPot, queries.addUserAnswers, queries.addUserPaymentInfo, queries.updatePayout);

module.exports = router;