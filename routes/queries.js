const db = require('../db/index');
const format = require('pg-format');
const { response } = require('express');

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
    db.query('SELECT questions.question, user_answers.answer, user_answers.answer_score FROM questions JOIN user_answers ON questions.id = user_answers.question_id WHERE user_answers.user_id=$1 ORDER BY user_answers.question_id',
    [id], (err, result) => {
        if(err){
            throw err
        }
        res.status(200).send(result.rows)
    })
}

//Get questions
const getQuestions = (req, res, next) => {
    db.query('SELECT id, question, answer1, answer2, answer3, answer4 FROM questions', (err, result) => {
        if(err){
            throw err;
        }
        res.status(200).send(result.rows);
    })
}

//Get game info
const getGameInfo = async (req, res, next) => {
    db.query('SELECT * FROM game_info', (err, result) => {
        if(err){
            throw err;
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
        orderId: req.body.paymentInfo.orderId,
        payerId: req.body.paymentInfo.payerId
    };
    db.query('INSERT INTO payment_info (user_id, payment_terms, paid, payment_method, order_id, payer_id) VALUES ($1, $2, $3, $4, $5, $6)',
    [paymentInfo.user_id, paymentInfo.paymentTerms, paymentInfo.paymentComplete, paymentInfo.paymentMethod, paymentInfo.orderId, paymentInfo.payerId],
    (err, result) => {
        if(err){
            throw err
        }
        next();
    })
    res.status(201).send();
}

//Update question scores
const updateScores = async (req, res, next) => {

    Promise.all([db.query('SELECT * FROM user_answers'), db.query('SELECT id, points, final_answer FROM questions')])
    .then(async (result) => {
        const answers = result[0].rows;
        const answer_key = result[1].rows;
        if(answers.length !== 0){
            await answers.map(row => {
                    let answer = answer_key.find(question => question.id === row.question_id);
                    
                    if(answer === undefined){
                        return 'Question not found';
                    }
                    if(answer.final_answer === row.answer && answer.final_answer !== null){
                        db.query('UPDATE user_answers SET answer_score=$1 WHERE user_id=$2 AND question_id=$3', 
                        [answer.points, row.user_id, row.question_id],
                        (err, result) => {
                            if(err){
                                throw err
                            }
                        })
                    }else if(answer.final_answer !== row.answer && answer.final_answer !== null){
                        db.query('UPDATE user_answers SET answer_score=$1 WHERE user_id=$2 AND question_id=$3', 
                        [0, row.user_id, row.question_id],
                        (err, result) => {
                            if(err){
                                throw err
                            }
                        })
                    }else{
                        db.query('UPDATE user_answers SET answer_score=$1 WHERE user_id=$2 AND question_id=$3', 
                        [null, row.user_id, row.question_id],
                        (err, result) => {
                            if(err){
                                throw err
                            }
                        })
                    }
                })
            //Update user scores after scoring questions
            updateUserScore();    
        }
        

    })
    
}
const updateAllScores = async () => {
    await updateUserScore().then(async result => {
        await setPot().then(result => {
            setPayOut();
        })
    })
}
//Update user overall score
const updateUserScore = async (req, res, next) => {
    //Select users 
    await db.query('SELECT id FROM users')
    .then( users => {
        const user_ids = users.rows;
        //Iterate through all users
        user_ids.map(async (user) => {
            //Select the user_answers based on user id
            
            await db.query('SELECT user_id, answer_score FROM user_answers WHERE user_id=$1', [user.id])
            .then(async (answers) => {
                const answerArry = answers.rows;
                let score=0;
                //Tally the score
                for(i=0; i<answerArry.length; i++){
                    if(answerArry[i].answer_score !== null){
                        score+=answerArry[i].answer_score;
                    }
                    
                }
                console.log(`Writing scores...${score}, ${answerArry[0].user_id}`)
                //Write score to users
                await db.query('UPDATE users SET score=$1 WHERE id=$2', [score, answerArry[0].user_id], (err, result) => {
                    if(err){
                        throw err;
                    }
                })
                //await setPot();
                //await setPayOut();
            })
        })
        //setPot();
    })
    
    //Set payout function
    //setPot();
    //setPayOut();  
}

const setPot = async () => {
    console.log('Setting pot...')
    //Fees
    //$1.5 server fee, $0.49 + $0.41 paypal transaction, $0.87 taxes on $12.40 transaction = $10 buy-in + $3.26 taxes and fees
    
    //Get user ids and payment (y/n) from payment_info
    //Get buy-in and fees from game_info
    Promise.all([db.query('SELECT user_id, paid FROM payment_info'), db.query('SELECT game_id, buy_in, fees FROM game_info')])
    .then(async (result) => {
        const paymentInfo = result[0].rows;
        const gameInfo = result[1].rows[0];
        const gameId = gameInfo.game_id;
        //Total collected = total paid users * (buy-in + fees)
        const totalCollected = paymentInfo.length * (Number(gameInfo.buy_in) + Number(gameInfo.fees));
        //total fees = total paid users * (fees)
        const totalFees = paymentInfo.length * Number(gameInfo.fees);
        //charity = (total collected - total fees) * 10%
        const charity = (totalCollected - totalFees) *0.1;
        //overhead = (total collected - total fees) * 5%
        const overhead = (totalCollected - totalFees) *0.05;
        //pot = total_collected - total fees - charity - overhead
        const pot = totalCollected - totalFees - charity - overhead;

        //Write to game_info
        await db.query('UPDATE game_info SET total_collected=$1, total_fees=$2, charity=$3, pot=$4, overhead=$5 WHERE game_id=$6',
        [totalCollected, totalFees, charity, pot, overhead, gameId], (err, result) => {
            if(err){
                throw err;
            }
        })
        
        //setPayOut();
       
    })
    
}

const setPayOut = async () => {
    console.log('Setting payout...')
    //Get the pot and charity
    db.query('SELECT id FROM questions')
    .then(result => {
        const answerKey = result.rows.sort((a,b) => a.id - b.id);
        const tieBreakerId = answerKey[answerKey.length -1].id;
    
        Promise.all([db.query('SELECT users.id, users.score, user_answers.answer FROM users JOIN user_answers ON users.id = user_answers.user_id WHERE user_answers.question_id=$1',
        [tieBreakerId]),
        db.query('SELECT charity, pot FROM game_info'),
        db.query('SELECT final_answer FROM questions WHERE id=$1', [tieBreakerId])])
        .then(result => {
            const users = result[0].rows;
            const pot = result[1].rows[0].pot;
            const charity = result[1].rows[0].charity;
            const totalPoints = result[2].rows[0].final_answer;
        
            //Set payout per place
            //1st = 60%, 2nd = 30%, 3rd = 10%
            const firstPlace = pot * 0.6;
            const secondPlace = pot * 0.3;
            const thirdPlace = pot *0.1;
            const payOut = [firstPlace, secondPlace, thirdPlace];
            
            //Add total Points difference to users
            for(let i=0; i < users.length; i++){
                let scoreDiff = Number(users[i].answer) - Number(totalPoints);
                if(scoreDiff < 0){
                    scoreDiff = scoreDiff * -1;
                }
                users[i].scoreDiff = scoreDiff;
            }
            //Sort users by score & final answer
            const sortedUsers = users.sort((a,b) => {
                //First sort by score
                if(a.score < b.score) return 1;
                if(a.score > b.score) return -1;

                //Sort by difference between final score and actual
                if(a.scoreDiff > b.scoreDiff) return 1;
                if(a.scoreDiff < b.scoreDiff) return -1;

            });

            let tiedUsers = []; //Create array for tied users to split pot
            let podium = { //Initiate a podium object
                firstPlace: [],
                secondPlace: [],
                thirdPlace: []
            };

            //Check that user array is >= payout
            if(users.length >= payOut.length){
                //Check for a tie (score below until unqiue value is found)
                for(let i=0; i <= payOut.length-1; i++){
                    let user = sortedUsers[i];
                    let nextUser = sortedUsers[i + 1];

                    tiedUsers.push(user); //initiate tied Users with the current user

                    //Check for tied user
                    let x = i; //create itterator for while loop outside of loop
                    while(user.score === nextUser.score && user.scoreDiff === nextUser.scoreDiff){
                        tiedUsers.push(nextUser);
                        //Check for end of array
                        if(x + 2 <= sortedUsers.length-1){
                            user = sortedUsers[x+1];
                            nextUser = sortedUsers[x+2];
                        }
                        x++;
                    }
                    

                    //Add the users array to podium object
                    if(podium.firstPlace.length === 0){
                        console.log(`first place i = ${i}`);
                        podium.firstPlace = tiedUsers;
                    }else if(podium.secondPlace.length === 0){
                        console.log(`second place i = ${i}`);
                        podium.secondPlace = tiedUsers;
                    }else if(podium.thirdPlace.length === 0){
                        console.log(`third place i = ${i}`);
                        podium.thirdPlace = tiedUsers;
                    }

                    //skip "nextUser" if there is a tie
                    if(tiedUsers.length > 1){
                        i++;
                    }
                    tiedUsers = []; //empty tied users array
                }

                
            }
            //Split the payout through the podium
            const firstPlaceTie = podium.firstPlace.length;
            const secondPlaceTie = podium.secondPlace.length;
            const thirdPlaceTie = podium.thirdPlace.length;
            

            //Split up the pot based on ties / no ties
            if(firstPlaceTie === 1 && secondPlaceTie === 1 && thirdPlaceTie ===1){
                podium.firstPlace[0].payOut = firstPlace;
                podium.secondPlace[0].payOut = secondPlace;
                podium.thirdPlace[0].payOut = thirdPlace;
            }else if(firstPlaceTie === 2 && secondPlaceTie === 1){
                //Two-way tie for first splits first and second place prize
                let payout = (firstPlace + secondPlace)/podium.firstPlace.length;
                for(let n=0; n<podium.firstPlace.length; n++){
                    podium.firstPlace[n].payOut = payout;
                }
                podium.secondPlace[0].payOut = thirdPlace;
                podium.thirdPlace = [];
            }else if(firstPlaceTie === 2 && secondPlaceTie === 2){
                //Two-way tie for first splits first and second place prize
                podium.firstPlace[0].payOut = (firstPlace + secondPlace)/2;
                podium.firstPlace[1].payOut = (firstPlace + secondPlace)/2;
                podium.secondPlace[0].payOut = thirdPlace/2;
                podium.secondPlace[1].payOut = thirdPlace/2;
                podium.thirdPlace = [];
            }else if(firstPlaceTie === 2 && secondPlaceTie >= 3){
                //Two-way tie for first splits first and second place prize
                podium.firstPlace[0].payOut = (firstPlace + secondPlace)/2;
                podium.firstPlace[1].payOut = (firstPlace + secondPlace)/2;
                for(let n=0; n<podium.secondPlace.length; n++){
                    podium.secondPlace[n].payOut = thirdPlace/podium.secondPlace.length;
                }
                podium.thirdPlace = [];
            }else if(firstPlaceTie >= 3){
                //Three or more way tie for first
                for(let n=0; n<podium.firstPlace.length; n++){
                    podium.firstPlace[n].payOut = (firstPlace + secondPlace + thirdPlace)/podium.firstPlace.length;
                }
                podium.secondPlace = [];
                podium.thirdPlace = [];
            }else if(firstPlaceTie === 1 && secondPlaceTie === 2){
                podium.firstPlace[0].payOut = firstPlace;
                podium.secondPlace[0].payOut = (secondPlace + thirdPlace) / 2;
                podium.secondPlace[1].payOut = (secondPlace + thirdPlace) / 2;
                podium.thirdPlace = [];
            }else if(firstPlaceTie === 1 && secondPlaceTie >= 3){
                podium.firstPlace[0].payOut = firstPlace;
                for(let n=0; n<podium.secondPlace.length; n++){
                    podium.secondPlace[n].payOut = (secondPlace + thirdPlace)/podium.secondPlace.length;
                }
                podium.thirdPlace = [];
            }else if(firstPlaceTie === 1 && secondPlaceTie === 1 && thirdPlaceTie ===2){
                podium.firstPlace[0].payOut = firstPlace;
                podium.secondPlace[0].payOut = secondPlace;
                podium.thirdPlace[0].payOut = thirdPlace / 2;
                podium.thirdPlace[1].payOut = thirdPlace / 2;
            }else if(firstPlaceTie === 1 && secondPlaceTie === 1 && thirdPlaceTie >=3){
                podium.firstPlace[0].payOut = firstPlace;
                podium.secondPlace[0].payOut = secondPlace;
                for(let n=0; n<podium.thirdPlace.length; n++){
                    podium.thirdPlace[n].payOut = (thirdPlace)/podium.thirdPlace.length;
                }
            }

            //convert podium into single array
            let queryArry = [];
            for(let i=0; i < podium.firstPlace.length; i++){
                queryArry.push(podium.firstPlace[i]);
            }
            for(let i=0; i < podium.secondPlace.length; i++){
                queryArry.push(podium.secondPlace[i]);
            }
            for(let i=0; i < podium.thirdPlace.length; i++){
                queryArry.push(podium.thirdPlace[i]);
            }

            //Set all payouts to zero
            db.query('UPDATE users SET payout=$1', [0],
                (err, result) => {
                    if(err){
                        throw err;
                    }
                })

            //Update database with user payouts
            for(let n=0; n < queryArry.length; n++){
                db.query('UPDATE users SET payout=$1 WHERE id=$2', [queryArry[n].payOut, queryArry[n].id],
                (err, result) => {
                    if(err){
                        throw err;
                    }
                })
            }
            
        })
        
        
    })
            
}

module.exports = {
    getAllUsers,
    getUsersPaymentInfo,
    getUserQuestionAnswers,
    addUser,
    addUserAnswers,
    addUserPaymentInfo,
    updateScores,
    setPot,
    updateUserScore,
    getQuestions,
    getGameInfo,
    updateAllScores
}