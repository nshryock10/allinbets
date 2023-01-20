import '../App';
import './Questions.css';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import ProgressBar from '../HelperComponents/ProgressBar';
import { calcProgress } from '../utils/utils';
import { useState } from 'react';
import { getQuestions as getQuestionList } from '../utils/api';

//Get questions from a data base of questions

function Questions() {

  let navigate = useNavigate();
  
  const location = useLocation();
  const user = {email: location.state?.email, 
                name: location.state?.name,
                userName: location.state?.userName,
                phone: location.state?.phone,
                mm: location.state?.mm,
                dd: location.state?.dd,
                yyyy: location.state?.yyyy,
                useTerms: location.state?.useTerms
                };
  const [questions, setQuestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [percentComplete, setPercentComplete] = useState(0)

  useEffect(() => {
    setIsLoading(true);
    getQuestions();
    
  },[]);

  const setProgress = () => {
    const progress = Number(calcProgress(questions)).toFixed(0);
    setPercentComplete(progress)
  }
  const getQuestions = async () => {

    const setQuestionList = (data) => {
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
  setQuestionList(data);
  setIsLoading(false);

}

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    for(let i=0; i < questions.length; i++){
      if(questions[i].answer === ''){
        alert('Fill out all questions!');
        return false;
      }
    }

    navigate("/checkout", {state:{questions:questions, user:user}});
    //Incorporate this to backend once ready
    /*
    let result = await submitForm(event.target);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('success');
    }
    */
    
  } 

    return (
    <div className='main'>
        <h1>{`${user.name}, make your bets!`}</h1>
          {isLoading && <p>Loading...</p>}
          <ProgressBar 
            progress={`${percentComplete}`}
          />
          {questions && questions.map((question, index) => (
              <QuestionCard 
                question={question} 
                setProgress={setProgress}
                key={index}
                finalAnswer={null}
              />
          ))}
          
          <Link onClick={handleSubmit} state={{questions:questions, user:user}} to='/checkout' >
              <button id="hero-button" type="submit" value="Submit Answers">Submit Answers</button>
          </Link>
    </div>
  )
};

export default Questions;