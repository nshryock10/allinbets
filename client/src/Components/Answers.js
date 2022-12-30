import '../App';
import './Answers.css';
import { useEffect, useState } from 'react';
import { getUserIndex, sortList } from '../utils/utils';
import { getUsers, getUserAnswers } from '../utils/api';

function Answers(props) {

  const [selectedUser, setSelectedUser] = useState('Select User');
  const [userIndex, setUserIndex] = useState(null);
  const [users, setUsers] = useState(props.dataBase);
  const [sortedUsers, setSortedUsers] = useState(sortList(props.dataBase))
  const [userData, setUserData] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() =>{
    if(selectedUser !== 'Select User'){
      setUserIndex(getUserIndex(selectedUser, userData)); 
      getAnswers(getUserIndex(selectedUser, userData))
    }
    }, [selectedUser]);

  useEffect(() => {
    //Get payment info
      getPayments();
  }, [])

  const getAnswers = async (id) => {
    const setMainAnswers = (questions) => {
      setQuestions(questions);
    }

    const userQuestions = await getUserAnswers(id);
    setMainAnswers(userQuestions);
  }
  const getPayments = async () => {

    const setMainPaymentInfo = (userData) => {
      setUserData(userData);
      setSortedUsers(sortList(userData, 'userName'));
    }

    const userData = await getUsers();
    setMainPaymentInfo(userData);
  }

  return (
    <div >
        <h1 >View your scores</h1>
        <label className="select-label">Pick a user to view</label>
        
        <select
            value={selectedUser}
            className="select-dropdown"
            onChange={(e) => {setSelectedUser(e.target.value)}}
          >
            <option 
                value={"Select User"}
                key={'A'}
                disabled
              >
                  Select User
              </option>
            {sortedUsers.map((user, index) => 
              <option 
                key={index}
                value={user.username}
              >
                  {user.username}
              </option>
            )}
        </select>

        {userIndex !== null && questions.map( (question, index) => (
          
          <div
            key={index}
            className="main-container"
          >
            <div className="card-container questionCard">
              <div className="question-container">
                <p className="question question-text">{question.question}</p>
                <p className="answer question-text">{question.answer}</p> 
              </div>
              {(question.answer_score !== null && question.answer_score > 0) ? 
              (<p className=" score correct-score">+{question.answer_score}</p>) : 
              (<p className="score incorrect-score"> {question.answer_score}</p>)}
            </div>
            
            
          </div>
        ))}

    </div>
  );
}
// 
//
export default Answers;