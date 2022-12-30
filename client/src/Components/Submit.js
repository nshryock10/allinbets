import '../App';
import './Submit.css';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoLogoVenmo } from "react-icons/io5";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {addUser as addUserToDB } from '../utils/api';

function Submit(props) {

  const location = useLocation();
  const questions = location.state?.questions;
  const updateUser = props.updateDataBase;
  const updateUserCount = props.updateUserCount;
  const userInfo = location.state?.user 
  const CLIENT_ID = 'AflGXddWb4KVamd5un9eY3zdBwkFwm0OfRztruHurzIKaHAj_ZEm4QSzFcaXDXW4gqDhlsu30_s2rmEC';
  const sb_ID = 'AaP9oeFAJXTholgWoJH_xSeqcl-3C_SdpcaJ_UjpkbtO2tGl4i9qx1kSGr4WHX_IPT72yr-p9LgAqbov';
  const paymentOptions = {
    "client-id": sb_ID,
    components: "buttons,funding-eligibility",
    "enable-funding": "venmo",
    currency: "USD",
    intent: "capture",

  }

  //Paypal details
  //Get this info from the data base
  const buyInAmount =  props.buyIn;
  const processingFee = props.fees;
  const total = Number(buyInAmount) + Number(processingFee);
  const currency = "USD";
  const style = { layout: "vertical" };
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  //Component to wrap button and handle currency change
  const ButtonWrapper = ({ currency, showSpinner }) => {

    const [{ options, isPending}, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: 'resetOptions',
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);

    return(<>
      { (isPending) && <div className="spinner">Loading...</div> }
      <PayPalButtons 
        style={style}
        disabled={false}
        forceReRender={[buyInAmount, currency, style]}
        //fundingSource="venmo"
        createOrder={(data, actions) => {
          return actions.order
              .create({
                purchase_units:[
                  {
                    amount: {
                      currency_code: currency,
                      value: total
                    },
                  },
                ],
                application_context: {
                  shipping_preference: "NO_SHIPPING"
                }
              })
              .then((orderId) => {
                return orderId;
              });
        }}
        onApprove={function (data, actions) {
          return actions.order.capture().then(() => {
            console.log(data)
            setUser({...user, paymentComplete: true, orderId: data.orderID, paymentMethod: data.paymentSource, payerId: data.payerID});
            
          });
        }}
        onError={function (err){
          alert(`Something when wrong, try signing up again. Error code ${err}`)
        } }
      />
    </>
    );
  }
  

  const [user, setUser] = useState({
                                      userInfo: userInfo,
                                      questions: questions,
                                      paymentMethod: null,
                                      paymentComplete: false,
                                      paymentTerms: false,
                                      orderId: null,
                                      payerId: null,
                                      score: 0,
                                      payout: 0,
                                      index: null
                                    })

  const handleChange = (e) => {
    const checked = e.target.checked;

    if(checked){
      setUser({...user, paymentTerms: true});
    
    }else{
      setUser({...user, paymentTerms: false});
    }
    
  }

  const handleSubmit = (e) => {
    //check payment terms are agreed to
    if(!user.paymentTerms){
      e.preventDefault();
      e.stopPropagation();
      alert('You must agree to the terms of payment.');
      return false;
    }
    //check that payment method is completed
    if(!user.paymentComplete){
      e.preventDefault();
      e.stopPropagation();
      alert('You must complete your payment before submitting your answers.');
      return false;
    }
    addUserToDB(user);
    //Update user count to have data refresh on home page
    updateUserCount(props.userCount++)
    
  }

  useEffect(() => {
    updateUser(user, user.index);
  }, [user])

  return (
    <div className="main">
        <h1>Complete payment to submit answers</h1>
        <form>
          <div className="questionCard">
            <h3>Checkout</h3>
            <div className="lineTotal">
              <p>Buy-in: </p>
              <p>${buyInAmount}</p>
            </div>
            <div className="lineTotal">
              <p>Processing and Service Fee:</p>
              <p>${processingFee}</p>
            </div>
            <div className="lineTotal total">
              <p>Total:</p>
              <p>${total}</p>
            </div>
          </div>
          <input 
            onChange={(e) => handleChange(e)}
            className="checkbox"
            type="checkbox"
            />
            <label className="checkbox-label">I have read and agree to the terms of payment</label>
        </form>

        {(user.paymentTerms && !user.paymentComplete) &&
        (<div id="paypal-button-container">
          <PayPalScriptProvider options={paymentOptions}>
            <ButtonWrapper
              currency={currency}
              showSpinner={false}
            />
          </PayPalScriptProvider>
        </div>
        )}
        {(user.orderId !== null) &&
          <div className="order-confirmation">
            <p>{`Thanks for your payment. Your order confirmation is ${user.orderId}`}</p>
          </div>
        }
        <div>
          {(user.paymentComplete && user.paymentComplete) && (
            
            <div>
              <Link to='/' 
                onClick={handleSubmit}
              >
              <button id="hero-button">Finish Payment</button> 
              </Link>
        </div> )}  

        

        </div>
    </div>
  );
}

export default Submit;