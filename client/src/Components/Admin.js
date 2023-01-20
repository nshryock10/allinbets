import React from 'react';
import QuestionCard from './QuestionCard';
import Login from './Login';
import { getQuestions as getQuestionList } from '../utils/api';
import { useState, useEffect } from 'react';
import './Admin.css'

function Admin() {

    const [questions, setQuestions] = useState() //Get the questions 
    const [token, setToken] = useState();

    //Wrtie function to write final answer to questions table
    useEffect(() => {

        getQuestions();

    }, [token])

    const setProgress = () => {
        //Dummy function as remnant from real question card
    }

    const getQuestions = async () => {

        const setQuestionArry = (data) => {
         //set questions in correct format
         const sortedData = data.sort((a, b) => a.id - b.id);
         //itterate throgh array
         for(let i=0; i < sortedData.length; i++){
          sortedData[i].options = [];
          for(const [key, value] of Object.entries(sortedData[i])){
            if((key==='answer1' || key==='answer2' || key==='answer3' || key==='answer4') && value !== null){
              sortedData[i].options.push(value);
            }
          }
         }
         setQuestions(sortedData);
        }
    
      const data = await getQuestionList();
        setQuestionArry(data);
    }

    if(!token){
        return <Login setToken={setToken} />
    }

    return (
        <div>
            <h1>Admin Page</h1>
            <h2>Update the question answers</h2>

            {questions ? questions.map((question, index) => {
                return <QuestionCard 
                            question={question} 
                            setProgress={setProgress}
                            key={index}
                            finalAnswer={'test'}
                        />
            }) : <div>Loading...</div>}
            <button id="hero-button">Save</button>
        </div>
        
    );
    }

    export default Admin;