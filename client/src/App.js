import './App.css';
import { useEffect, useState } from 'react';
import HomePage from './Components/HomePage';
import SignUp from './Components/SignUp';
import Questions from './Components/Questions';
import Submit from './Components/Submit';
import Answers from './Components/Answers';
import Nav from './Components/Nav';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { generateUserIndex } from './utils/utils';
import { getPaymentInfo, getUsers, getGameInfo } from './utils/api';

function App() {

  const [dataBase, setDataBase] = useState([]);  
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [gameInfo, setGameInfo] = useState({});

  useEffect(() => {

    if(dataBase.length === 0){
      getDataBase();
    }

  }, [userCount])

  const getDataBase = async () => {
    //Callback function to set data
    const setMainDataBase = (data, paymentData, gameInfo) => {
      setDataBase(data);
      //setPaymentInfo(paymentData);
      setGameInfo(gameInfo[0]);

    } 

    //Postgres data
    const dbData = await getUsers();
    const payData = await getPaymentInfo();
    const gameInfo = await getGameInfo();
    setMainDataBase(dbData, payData, gameInfo);
  }

  const addUser = (user, index) => {
    //Check for user index
    if(index){
      setDataBase(data => [...data.slice(0,index), user, ...data.slice(index+1)])
    }else{
      user.index = generateUserIndex(dataBase);
      setDataBase(data => [...data.slice(0,user.index), user, ...data.slice(user.index+1)])
    }
  }

  return (
    <Router> 
      <div className="App">
        <div className="content-container">
          <Nav />
          <Routes> 
            <Route path='/' element={<HomePage dataBase={dataBase}  pot={gameInfo.pot} />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='questions' element={<Questions />} />
            <Route path='answers' element={<Answers dataBase={dataBase} />} />
            <Route path='checkout' element={<Submit 
                                              updateUserCount={setUserCount} 
                                              userCount={userCount} 
                                              updateDataBase={addUser}
                                              buyIn={gameInfo.buy_in}
                                              fees={gameInfo.fees}
                                              />} 
            />
          </Routes>
        </div>
        <footer>
          <ul className="footer-links">
            <li>About</li>
            <li>Charities</li>
            <li>Scores</li>
            <li>Contact Us</li>
          </ul>
        </footer>
      </div>
    </Router> 
  );
}

export default App;
