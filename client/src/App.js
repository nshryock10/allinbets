import './App.css';
import { useEffect, useState } from 'react';
import HomePage from './Components/HomePage';
import HomePage1 from './Components/HomePage1';
import SignUp from './Components/SignUp';
import Questions from './Components/Questions';
import Submit from './Components/Submit';
import Answers from './Components/Answers';
import Contact from './StaticPages/Contact';
import Nav from './Components/Nav';
import Admin from './Components/Admin';
import PaymentPolicy from './StaticPages/PaymentPolicy';
import LoadingSkeleton from './HelperComponents/LoadingSkeleton'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { generateUserIndex } from './utils/utils';
import { getPaymentInfo, getUsers, getGameInfo } from './utils/api';

function App() {

  const [dataBase, setDataBase] = useState([]);  
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [gameInfo, setGameInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userPaid, setUserPaid] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(getDataBase(), 3000)
    return () => clearTimeout(timer);

  }, [])

  const getDataBase = async () => {
    //Callback function to set data
    const setMainDataBase = (data, gameInfo) => {
      //console.log('Setting data...')
      setIsLoading(false)
      setDataBase(data);
      setGameInfo(gameInfo[0]);

    } 

    //Postgres data
    Promise.all([getUsers(), getGameInfo()])
    .then(results => {
      //console.log('grabbing data...')
      setMainDataBase(results[0], results[1])
    })
    //const dbData = await getUsers();
    //const payData = await getPaymentInfo();
    //const gameInfo = await getGameInfo();
    //setMainDataBase(dbData, payData, gameInfo);
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
//
  return (
    <Router> 
      <div className="App">
        <div className="content-container">
          <Nav />
          <Routes> 
            <Route path='/' element={!isLoading ? <HomePage1 
                                                      dataBase={dataBase}  
                                                      pot={gameInfo.pot} 
                                                      userPaid={userPaid}
                                                      setUserPaid={setUserPaid}
                                                    /> : <LoadingSkeleton/>} />
            <Route path='signup' element={<SignUp />} />
            <Route path='questions' element={<Questions />} />
            <Route path='answers' element={<Answers dataBase={dataBase} />} />
            <Route path='checkout' element={<Submit 
                                              updateUserCount={setUserCount} 
                                              userCount={userCount} 
                                              updateDataBase={addUser}
                                              buyIn={gameInfo.buy_in}
                                              fees={gameInfo.fees}
                                              setUserPaid={setUserPaid}
                                              />} 
            />
            <Route path='paymentpolicy' element={<PaymentPolicy />}/>
            <Route path='contact' element={<Contact />}/>
            <Route path='admin' element={<Admin />}/>
          </Routes>
        </div>
        <footer>
          <ul className="footer-links">
            <li>Brought to you by Shryock Web Design</li>
          </ul>
        </footer>
      </div>
    </Router> 
  );
}

export default App;
