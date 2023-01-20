import { getUsers as getDataBase } from "./api";

//Generates an index for the user based on the length of the database
//INPUT: database array from main App
//OUTPUT: id field for user infomation that matches array input, integer
export const generateUserIndex = (dataBase) => {
    const id = dataBase.length;
    return id; 
}

//Returns the index of a selected user 
//INPUT: the userName of interest and the dataSet (dataBase)
//OUTPUT: The index of the input username, integer
export const getUserIndex = (userName, dataSet) => {
    if(userName !== "Select User"){
        const userIndex = dataSet.filter(user => user.username === userName);
        return userIndex[0].id;}
    else{
        return null;
    }
}

//Function updates the score of the questions that have answers
//INPUT: user questions & answers (userAnswers) and the question key (questionKey)
//OUTPUT: array with objects that include the score
export const scoreAnswers = (userAnswers, questionKey) => {
  

    const keyLength = questionKey.length;
    //Cannot define paymentComplete for some reason 
    let payment = userAnswers.paymentComplete;
    let key = questionKey;
    let answers = userAnswers.questions;
    let totalScore = 0;

    //Check if payment is compelte
    if(!payment){
      console.log('User did not finish payment');
      return [userAnswers, 0]
    }else {
      for(let i = 0; i < keyLength; i++){
          let answer = answers[i].answer;
          let keyAnswer = key[i].answer;

          //If there is an answer and the answer equals the key then score = points 
          if(keyAnswer !== null && answer === keyAnswer){
              answers[i].score = key[i].points;
              totalScore += key[i].points;
          }else if(keyAnswer !== null && answer !== keyAnswer){
              answers[i].score = 0;
          }
      }

      return [answers, totalScore];
  }
}

//Assigns the payout for users based on score and pot
//INPUT: Total Pot and UserData base
//OUTPUT: 
export const setPayOut = (pot, dataBase) => {

  //Return an empty array if there is no data passed. 
  if(dataBase.length === 0){
    return [];
  }
  //Set payout structure
  const payout = [(0.75 * pot), (0.20 * pot), (0.05 * pot)]

  //Scenario
    //Multiplace tie

  //Sort dataBase by score usign sortList function
  const sortedData = sortList(dataBase, 'score');
  
  for(let i=0; i< payout.length; i++){
    sortedData[i].payout = payout[i];
  }

  return sortedData;
}

//Sorts a list of arrays based on the sort field indicated
//INPUT: The list to be sorted and the sort field (only score and username)
//OUTPUT: The sorted list
export const sortList = (list, field) => {

    const sorted = [...list].sort((a, b) => {
        
        if(field === 'score'){

            return (
                a['score'].toString().localeCompare(b['score'].toString(), 'en', {numeric: true})
            )*-1

        }else if(field === 'userName'){
            return (
                a['username'].toString().localeCompare(b['username'].toString(), 'en', {numeric: true})
            )

        }
    });

    return sorted;
}

//Searches user names in the data base and returns the most relevent value
//INPUT: Search term from search bar and data base
//OUTPUT: most relevent search term
export const searchUserName = (query, list) => {
    let match;
    if(query){
        match = list.find(user => {
        if(user.username.toLowerCase().includes(query.toLowerCase())){
            return user;
        }
    })}
    if(match){
        //Return the object and display name, score, and payout on homepage
        return [match.username, match.payout, match.score]
    }else{
        return null;
    }

}


//Returns the current date in an array with [mm, dd, yyyy]
export const getDate = () => {
  const today = new Date();
  //Month is returning 10??
  const todayDate = [today.getMonth()+1, today.getDate(), today.getFullYear()];

  return todayDate;
}

export const verifyAge = (mm, dd, yyyy) => {

  const today = getDate();

  if ((today[2] - yyyy < 21)) { //If year is less than 21 no need to check month and day
    
    alert('You must be 21 to play. Come back next year!')
    return false;
  }else if ((today[2] - yyyy === 21)) { //If year = 21 then check the month and day
    
    if(today[0] - mm < 0){ //If birthday is same year check the month
      
      alert('You must be 21 to play. Come back next year!') 
      return false;
    } else if (today[1] - dd < 0){ //If birthday is same month check the day
      
      alert('You must be 21 to play. Come back next year!') 
      return false;
    }
  }

  return true //return true if none of the fail conditions are met
}

export const checkUserName = async (username) => {

  const dataBase = await getDataBase();
  let userNameTaken = false;
  
  
  dataBase.forEach(user => {
    if(user.username == username){
      userNameTaken = true;
    }
  })
  
  return userNameTaken;

}

export const verifyForm = (value, field) => {

  const date = getDate();

  if(field === 'mm'){
    if(value > 12 || value < 1 || isNaN(value)){
      return true;
    }else{
      return false;
    }
  }else if(field === 'dd'){
    if(value > 31 || value < 1 || isNaN(value)){
      return true;
    }else{
      return false;
    }
  }else if(field === 'yyyy'){
    if(value > date[2] || value < 1900 || isNaN(value)){
      return true;
    }else{
      return false;
    }
  }
}

//Calculate question progress
export const calcProgress = (arr) => {

  const totalQuestion = arr.length;
  let answeredQuestions = 0;

  //Determine number of answered questions
  for(let i=0; i<arr.length; i++){
    if(arr[i].answer){
      answeredQuestions++;
    }
  }
  const percentComplete = (answeredQuestions/totalQuestion) * 100;

  return percentComplete;
}