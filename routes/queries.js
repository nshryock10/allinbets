const db = require('../db/index');
const format = require('pg-format');
const { v4: uuidv4 } = require("uuid");

//Get all users from data base
const getAllUsers = (req, res, next) => {
    db.query('SELECT * FROM users', (err, result) => {
        if(err){
            throw err
        }
        console.log(result.rows)
        res.status(200).send(result.rows);
    })
};

//Get specific user from data base

//Get Questions

//Add user to database
const addUser = (req, res, next) => {
    
    //Generate unique ID
    const newId = uuidv4();
    //Extract user info
    const userInfo = {
        name: req.body.userInfo.name,
        username: req.body.userInfo.username,
        birthday: req.body.userInfo.birthday,
        email: req.body.userInfo.email,
        use_terms: req.body.userInfo.use_terms
    };
    
    //Query new user to database
    db.query('INSERT INTO users (id, name, username, birthday, email, use_terms) VALUES ($1, $2, $3, $4, $5, $6)',
    [newId, userInfo.name, userInfo.username, userInfo.birthday, userInfo.email, userInfo.use_terms],
    (err, result) => {
        if(err){
            throw err
        }
    })

    /*-------- Add question answers ---------------- */
    //Format data into array
    const question_answers = req.body.questionAnswers.map(question => [ newId, question.id, question.answer, question.score]);
    const sql = format('INSERT INTO user_answers (user_id, question_id, answer, answer_score) VALUES %L', question_answers);
    //Add info into user_answers table
    db.query(sql, [], (err, result) => {
        if(err){
            throw err
        }
    });
    
    //Add payment info
    const paymentInfo = {
        paymentTerms: req.body.paymentInfo.paymentTerms,
        paymentComplete: req.body.paymentInfo.paymentComplete,
        paymentMethod: req.body.paymentInfo.paymentMethod,
        orderId: req.body.paymentInfo.orderId
    };
    db.query('INSERT INTO payment_info (user_id, payment_terms, paid, payment_method, order_id) VALUES ($1, $2, $3, $4, $5)',
    [newId, paymentInfo.paymentTerms, paymentInfo.paymentComplete, paymentInfo.paymentMethod, paymentInfo.orderId],
    (err, result) => {
        if(err){
            throw err
        }
    })

    res.status(201).json(`User added with ID ${newId}`);
}



module.exports = {
    getAllUsers,
    addUser
}