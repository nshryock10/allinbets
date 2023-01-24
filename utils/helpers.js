const rankUsers = (users) => {
    //Sort users by score & final answer
    const sortedUsers = users.sort((a,b) => {
        //First sort by score
        if(a.score < b.score) return 1;
        if(a.score > b.score) return -1;

        //Sort by difference between final score and actual
        if(a.scoreDiff > b.scoreDiff) return 1;
        if(a.scoreDiff < b.scoreDiff) return -1;

    });

    return sortedUsers;
}

const scoreAnswers = (userAnswers, answerKey) => {

    const scoredAnswers = [];
    //Sort questions by id and grab tie breaker id (always last question)
    const sortedKey = answerKey.sort((a,b) => {
        //First sort by id
        if(a.id > b.id) return 1;
        if(a.id < b.id) return -1;
    });
    const tieBreakerId = sortedKey[sortedKey.length -1].id;

    if(userAnswers.length !== 0){
        userAnswers.map(row => {
            let answer = answerKey.find(question => question.id === row.question_id);
            let user = scoredAnswers.find(user => user.id === row.user_id);
            if(!user){
                user = {
                    id: row.user_id,
                    score: null,
                    payOut: null,
                    questions: []
                }

                scoredAnswers.push(user);
            }

            if(answer === undefined){
                return 'Question not found';
            }
            if(answer.final_answer === row.answer && answer.final_answer !== null){
                user.questions.push({question_id: row.question_id, score: answer.points});
            }else if(answer.final_answer !== row.answer && answer.final_answer !== null){
                user.questions.push({question_id: row.question_id, score: 0});
            }else{
                user.questions.push({question_id: row.question_id, score: null});
            }
            //Add tie breakerAnswer
            if(row.question_id === tieBreakerId){
                user.tieAnswer = row.answer;
            }
            console.log('tie breaker id')
            console.log(tieBreakerId);
        })

        return scoredAnswers;
    }
}

const accumulateScore = (users) => {
    const scoredUsers = users;
     scoredUsers.map(user => {
        let score =0;
        user.questions.map(question => {
            score = score + question.score;
        })
        user.score = score;
     }) 
     return scoredUsers;
}

const setPodium = (users, payOut, answerKey) => {
    //Sort questions by id and grab tie breaker id (always last question)
    const sortedKey = answerKey.sort((a,b) => {
        //First sort by id
        if(a.id > b.id) return 1;
        if(a.id < b.id) return -1;
    });

    const tieBreakerAns = sortedKey[sortedKey.length-1].final_answer;
    console.log('tie breaker answer')
    console.log(tieBreakerAns);

    //Add total Points difference to users
    for(let i=0; i < users.length; i++){
        let userTieBreakAnswer = users[i].tieAnswer;
        let scoreDiff = Number(userTieBreakAnswer) - Number(tieBreakerAns);
        if(scoreDiff < 0){
            scoreDiff = scoreDiff * -1;
        }
        users[i].scoreDiff = scoreDiff;
        console.log('score diff')
        console.log(scoreDiff)
    }
    
    //Sort users by score
    const sortedUsers = rankUsers(users);

    let tiedUsers = []; //Create array for tied users to split pot

    let podium = { //Initiate a podium object
        firstPlace: [],
        secondPlace: [],
        thirdPlace: []
    };

    //Check that user array is >= payout
    if(users.length > payOut.length){
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
                podium.firstPlace = tiedUsers;
            }else if(podium.secondPlace.length === 0){
                podium.secondPlace = tiedUsers;
            }else if(podium.thirdPlace.length === 0){
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

    const firstPlace = payOut[0];
    const secondPlace = payOut[1];
    const thirdPlace = payOut[2];

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

    return queryArry;
}

module.exports = {
    rankUsers,
    scoreAnswers,
    setPodium,
    accumulateScore
}