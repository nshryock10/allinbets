const queries = require('./queries');
const db = require('../db/index');
const express = require('express');
const router = express.Router();


router.get("/", (req, res, next) => {
    res.json({ info: 'Node.js, Express, and Postgres API for HotGuyPropBets' });
})

//Listens for updates to final answers and updates scores
if(process.env.PORT){
    db.prodListener.connect(() => console.log('Database connected in production mode'));
    db.prodListener.query('LISTEN answer_update');
    db.prodListener.on('notification', () => {
        console.log('Database question updated...')
        queries.updatePayout()
    });
}else{
    db.listener.connect(() => console.log('Database connected in dev mode'));
    db.listener.query('LISTEN answer_update');
    db.listener.on('notification', () => {
        console.log('Database question updated...')
        queries.updatePayout()
    });
}



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

//Get Login token
router.post('/login', (req, res) => {
    const username = req.params.username;
    const password = req.params.password;
    if(username==='rivRock' && password==='champ123'){
        res.send({token: 'test123'});
    }else{

    }   res.send({token: 'incorrect'})
    
})

//Add user to data base
router.post('/users', queries.addUser, queries.setPot, queries.addUserAnswers, queries.addUserPaymentInfo, queries.updatePayout);


module.exports = router;