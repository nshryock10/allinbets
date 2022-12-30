import '../App';
import './Questions.css'
import React from 'react';


function QuestionCard(props) {
  
    const question = props.question;
    const index = props.index;

    const setAnswer = (answer, index) => {
        question.answer = answer;
    }

    return (
    <div className="questionCard">
        <form>
            <label className="question-label">{question.question}</label>
            {question.options && question.options.map((option, index) => 
            <div key={index}>
                <input 
                    type='radio'
                    defaultChecked={false}
                    value={option}
                    name='andOp'
                    onChange={(e) => {setAnswer(e.currentTarget.value)}}
                />
                <label>{option}</label>
            </div>)}
          
            {question.options.length === 0 && 
            <div>
                <input 
                    type='text'
                    className="question-input"
                    name={index}
                    onChange={(e) => {setAnswer(e.currentTarget.value)}}
                />
            </div>}
        </form>
    </div>
  )
};

export default QuestionCard;