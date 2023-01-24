import { v4 as uuid4 } from 'uuid';

//export const API_ENDPOINT = "http://localhost:3000"; //Uncomment in Dev
export const API_ENDPOINT = "https://all-in-bets.herokuapp.com"; //Uncomment in production

//Get all users from database
export const getUsers = async () => {
    const response = await fetch(`${API_ENDPOINT}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          }
    })

    const users = await response.json();
    
    return users;
}

//Get user payment info
export const getPaymentInfo = async () => {
    const response = await fetch(`${API_ENDPOINT}/paymentinfo`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          }
    })

    const paymentInfo = await response.json();

    return paymentInfo;
}

export const getGameInfo = async () => {
    const response = await fetch(`${API_ENDPOINT}/gameinfo`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          }
    })

    const gameInfo = await response.json();

    return gameInfo;
}

export const getUserAnswers = async (id) => {
    
    const response = await fetch(`${API_ENDPOINT}/answers/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          }
    })

    const answers = await response.json();

    return answers;
}

export const getQuestions = async () => {
    const response = await fetch(`${API_ENDPOINT}/questions`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          }
    })

    const questions = await response.json();

    return questions;
}

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_ENDPOINT}/login`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(credentials)
    })

    const token = await response.json();

    return token;
}

//Add user to data base
export const addUser = async (user) => {

//Generate new Id
const newId = uuid4();

const userInfo = {
    id: newId,
    name: user.userInfo.name,
    username: user.userInfo.userName,
    birthday: `${user.userInfo.yyyy}-${user.userInfo.mm}-${user.userInfo.dd}`,
    email: user.userInfo.email,
    phone: user.userInfo.phone,
    use_terms: user.userInfo.useTerms
};
const answers = user.questions;
const paymentInfo = {
    paymentTerms: user.paymentTerms,
    paymentComplete: user.paymentComplete,
    paymentMethod: user.paymentMethod,
    orderId: user.orderId,
    payerId: user.payerId
}

    const response = await fetch(`${API_ENDPOINT}/users`, {
        //Extract user information from the form
        method: "POST",
        body: JSON.stringify({
            userInfo: userInfo,
            questionAnswers: answers,
            paymentInfo: paymentInfo
        }
        ),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : true 
          }
    })
    response.json();

}