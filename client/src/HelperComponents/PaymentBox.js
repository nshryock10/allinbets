import React, { useEffect } from 'react';
import { IoCloseOutline } from "react-icons/io5";

function PaymentBox({user, setUserPaid}) {

    const Parentdiv = { 
        height: '100px', 
        maxWidth: '350px', 
        backgroundColor: 'var(--neutral)', 
        border: 'black 1px solid', 
        borderRadius: 10,
        margin: 25,
        position: '-webkit-sticky',
        position: 'sticky',
        position: 'absolute',
        margin: '15px 0 0 10px',
        top: '10px',
        float: 'left'
    } 
      
    const orderText = { 
        padding: 10, 
        color: 'black', 
        fontWeight: 400,
        margin: '30px 0 0 0'
    }

    const closeIcon = {
        height: '30px',
        width: '30px',
        float: 'left',
        margin: '7px 0 0 7px'
    }

    useEffect(() => {
        console.log(user);
    }, [])

    const handleClick = () => {
        setUserPaid(false);
    }

    const orderId = user.orderId;
    const name = user.userInfo.name;

  return (
    <div style={Parentdiv}> 
        <IoCloseOutline  style={closeIcon} onClick={handleClick}/>
        <p style={orderText} >{`Thanks for your payment ${name}. Your order confirmation is ${orderId}`}</p>
    </div> 
    
  );
}

export default PaymentBox;