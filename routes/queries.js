const db = require('../db/index');
const format = require('pg-format');

//Get all users from data base
const getAllUsers = (req, res, next) => {
    db.query('SELECT users.*, payment_info.paid FROM users JOIN payment_info ON users.id = payment_info.user_id', (err, result) => {
        if(err){
            throw err
        }
        res.status(200).send(result.rows);
    })
};


//Get all user payment info
const getUsersPaymentInfo = (req, res, next) => {
    db.query('SELECT * FROM payment_info', (err, result) => {
        if(err){
            throw err
        }
        res.status(200).send(result.rows);
    })
}

//Get a specific users questions and answers
const getUserQuestionAnswers = (req, res, next) => {
    const id = req.params.id;
    db.query('SELECT questions.question, user_answers.answer, user_answers.answer_score FROM questions JOIN user_answers ON questions.id = user_answers.question_id WHERE user_answers.user_id=$1',
    [id], (err, result) => {
        if(err){
            throw err
        }
        res.status(200).send(result.rows)
    })
}

//Add user to database
const addUser = async (req, res, next) => {   
    //Extract user info
    const userInfo = {
        id: req.body.userInfo.id,
        name: req.body.userInfo.name,
        username: req.body.userInfo.username,
        birthday: req.body.userInfo.birthday,
        email: req.body.userInfo.email,
        use_terms: req.body.userInfo.use_terms
    };
    
    //Query new user to database
    db.query('INSERT INTO users (id, name, username, birthday, email, use_terms) VALUES ($1, $2, $3, $4, $5, $6)',
    [userInfo.id, userInfo.name, userInfo.username, userInfo.birthday, userInfo.email, userInfo.use_terms],
    (err, result) => {
        if(err){
            throw err
        }
        next();
    })

    res.status(201).send();
}

const addUserAnswers = (req, res, next) => {
    //Format data into array
    const user_id = req.body.userInfo.id;
    const question_answers = req.body.questionAnswers.map(question => [ user_id, question.id, question.answer, question.score]);
    const sql = format('INSERT INTO user_answers (user_id, question_id, answer, answer_score) VALUES %L', question_answers);
    //Add info into user_answers table
    db.query(sql, [], (err, result) => {
        if(err){
            throw err
        }
        next();
    });

    res.status(201).send();
}

const addUserPaymentInfo = (req, res, next) => {
    const paymentInfo = {
        user_id: req.body.userInfo.id,
        paymentTerms: req.body.paymentInfo.paymentTerms,
        paymentComplete: req.body.paymentInfo.paymentComplete,
        paymentMethod: req.body.paymentInfo.paymentMethod,
        orderId: req.body.paymentInfo.orderId
    };
    db.query('INSERT INTO payment_info (user_id, payment_terms, paid, payment_method, order_id) VALUES ($1, $2, $3, $4, $5)',
    [paymentInfo.user_id, paymentInfo.paymentTerms, paymentInfo.paymentComplete, paymentInfo.paymentMethod, paymentInfo.orderId],
    (err, result) => {
        if(err){
            throw err
        }
        
    })
    res.status(201).send();
}


module.exports = {
    getAllUsers,
    getUsersPaymentInfo,
    getUserQuestionAnswers,
    addUser,
    addUserAnswers,
    addUserPaymentInfo
}