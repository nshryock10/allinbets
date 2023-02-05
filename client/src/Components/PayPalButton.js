import React, { useState } from 'react';
import { useEffect } from 'react';
import LoadingDots from '../HelperComponents/LoadingDots';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";


function PayButtons (props) {

    const [{ options, isPending}, dispatch] = usePayPalScriptReducer();
    const paid = props.paid;
    const setPaid = props.setPaid;
    const handleSubmit = props.handleSubmit;


    const currency = "USD";
    const style = { layout: "vertical" };
    const CLIENT_ID = 'AflGXddWb4KVamd5un9eY3zdBwkFwm0OfRztruHurzIKaHAj_ZEm4QSzFcaXDXW4gqDhlsu30_s2rmEC';
    const sb_ID = 'AaP9oeFAJXTholgWoJH_xSeqcl-3C_SdpcaJ_UjpkbtO2tGl4i9qx1kSGr4WHX_IPT72yr-p9LgAqbov';
    const paymentOptions = {
      "client-id": CLIENT_ID,
      components: "buttons,funding-eligibility",
      "enable-funding": "venmo",
      currency: "USD",
      intent: "capture",
  
    }
    const user = props.user;
    const setUser = props.setUser;
    const showSpinner = props.showSpinner;
    const buyInAmount = props.buyInAmount;
    const total = props.total;
  
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
      { (isPending) && <LoadingDots /> }
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
          return actions.order.capture().then(async () => {
            setUser({...user, paymentComplete: true, orderId: data.orderID, paymentMethod: data.paymentSource, payerId: data.payerID})
            setPaid(true)
          });
        }}
        onError={function (err){
          alert(`Something went wrong, try signing up again. Error code ${err}`)
        } }
      />
    </>
    //user, setUser
    );
  }

export default PayButtons;