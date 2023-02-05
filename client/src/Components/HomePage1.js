import React from 'react';
import './HomePage.css';
import '../App';
import Table from './Table';
import nfl_logo from '../images/superbowl_logo.png';
import { getAnswerKey } from '../utils/utils';
import { Link, useLocation } from 'react-router-dom';
import PaymentBox from '../HelperComponents/PaymentBox';
import * as Icon from 'react-bootstrap-icons';
import { addUser } from '../utils/api';
import { useEffect } from 'react';

function HomePage1 (props) {

    const dataBase = props.dataBase;
    const payData = props.paymentData;
    const userPaid = props.userPaid;
    const setUserPaid = props.setUserPaid;
    const pot = props.pot;  
    const location = useLocation();
    //const answerKey = getAnswerKey();

    useEffect(() => {
      const timer = setTimeout(() => console.log('home page rendered...'), 3000);

      return () => clearTimeout(timer)
    }, [])

    const onClick = () => {
      addUser();
      console.log(dataBase)
    }
    /*
      
<div className="button-section">
          <Link to='signup'>
            <button id="hero-button">PLAY NOW</button>
          </Link>
        </div>
        */
    return (
    <div className="main">
        <h2 className="main-header" >Easy, straight forward, prop bets for Superbowl LVII </h2>

      <div className="body">

        <div className="home-hero section">
          <div className="hero-flex-container">
            <h1 onClick={onClick}>JOIN IN AND GET YOUR CHANCE AT ${Number(pot).toFixed(2)} and COUNTING</h1>
          </div>
          <div className="hero-flex-container">
            <img alt="nfl logo" className="img" src={nfl_logo} />
          </div>
          
        </div>
        
        {(userPaid && location.state.user) &&
        <div>
            <PaymentBox user={location.state.user} setUserPaid={setUserPaid}/>
        </div>

        }
       <div className="home-hero">
            <h3>Sign-ups start Saturday!</h3>
        </div>
        <div className="section instructions">
          <div className="instruction-step">
            <div className="step-content">
              <p className='step'>1. Sign up and pay the $10 buy-in</p>
              <Icon.Pencil className="question-icon" />
            </div>
          </div>

            <div className="instruction-step">
              <div className="step-content">
                <p className='step'>2. Answer the questions that take no previous knowledge</p>
                <Icon.ListCheck className="question-icon" />
              </div>
            </div>

            <div className="instruction-step">
              <div className="step-content">
                <p className='step'>3. Watch and enjoy as you climb up the leaderboard</p>
                <Icon.CurrencyDollar className="question-icon" />
              </div>
            </div>

        </div>

        <div className="section leader-board">
          
          <Table 
            data={dataBase} 
            payData={payData}
            //answerKey={answerKey}
            pot={pot}
          />
        </div>
        
      </div> 

    </div>
    )
  };


export default HomePage1;
