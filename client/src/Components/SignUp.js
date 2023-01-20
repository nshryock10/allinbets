import '../App';
import './SignUp.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkUserName, verifyAge, verifyForm } from '../utils/utils';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

function SignUp() {

  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState(false);
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [userNameMessage, setUserNameMessage] = useState(false);
  const [phone, setPhone] = useState(false);
  const [mm, setMm] = useState('');
  const [dd, setDd] = useState('');
  const [yyyy, setYyyy] = useState('');
  const [dateMessage, setDateMessage] = useState(false);
  const [useTerms, setUseTerms] = useState(false);
  let navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    //Check that user completed all fields
    if( email === '' ||
        name === null ||
        userName === null ||
        phone === false ||
        mm === null ||
        dd === null ||
        yyyy === null){

        alert('Please fill out all fields')
        return false;

      }else if (!verifyAge(mm, dd, yyyy)){ //Check that user is 21

        return false;
      
      }else if (emailMessage ||
                userNameMessage ||
                dateMessage){
          alert('Correct input errors')
          return false;
        }
      
      //Navigate to next page if all conditions pass
      navigate("/questions", {state:{
          email: email,
          name:name,
          userName: userName,
          phone: phone,
          mm: mm,
          dd: dd,
          yyyy: yyyy,
          useTerms: useTerms
        }});
      
  }

  const handleCheckChange = e => {
    const checked = e.target.checked;
    if(checked){
      setUseTerms(checked)
    }else{
      setUseTerms(checked)
    }
  }

  const handleBlur = async (e) => {
    //Call function to check if username is taken
    const value = e.currentTarget.value;
    const inputID = e.target.id;
    let regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    switch(inputID){
      case('username'):
        const userNameTaken = await checkUserName(value)
        if(userNameTaken){  
          setUserNameMessage(true);
        }
        break;
      case('email'): 
      
        //Validate email
        if (!regEx.test(email)){ //Check if email is valid
          setEmailMessage(true);
        }else{
          setEmailMessage(false)
        }
        break;
      case('birthday-input'):
        //Check dates
        if(verifyForm(value, e.target.placeholder)){
          setDateMessage(true);
        }else{
          setDateMessage(false);
        }
        break;
    }
    }

    const handleChange = e => {
      console.log(e)
    }

  return (
    <div className="main">
        <h1>Sign up now to play!</h1>
        <form className="signup-form">
          <div className="signup-input-container">
            <label 
                className="signup-label"
                for="email"
            >EMAIL ADDRESS:</label>
            <input 
                className="signup-input" 
                id="email"
                type="email"
                requried
                onChange={(e) => setEmail(e.currentTarget.value)}
                onBlur={(e) => handleBlur(e)}>
            </input>
          </div>
          {emailMessage && <p className="form-error">E-Mail is not valid</p>}
          <div className="signup-input-container">
            <label 
                className="signup-label"
                for="name"
            >NAME:</label>
            <input 
                className="signup-input" 
                id="name"
                type="text"
                onChange={(e) => setName(e.currentTarget.value)}
            ></input>
          </div>
          <div className="signup-input-container">
            <label className="signup-label"
            >USERNAME:</label>
            <input 
              className="signup-input"
              id="username"
              onChange={(e) => {
                setUserName(e.currentTarget.value)
                setUserNameMessage(false)
              }}
              onBlur={(e) => handleBlur(e)}
            ></input>
          </div>
          <div className="signup-input-container">
              <label className="signup-label" >PHONE NUMBER:</label>
              <PhoneInput 
                country={'us'}
                id="phone"
                disableDropdown={true} 
                onChange={(number) => setPhone(number)}
              />
          </div>
          {userNameMessage && <p className="form-error">User name is not available</p>}
          <div className="signup-input-container">
            <label className="signup-label">BIRTHDAY:</label>
              <div className="birthday-container">
                <input className="signup-input" 
                        id="birthday-input" 
                        type="number"
                        placeholder='mm' 
                        onChange={(e) => {
                          setMm(e.currentTarget.value)
                          //setDateMessage(false);
                        }}
                        onBlur={(e) => handleBlur(e)}>
                  </input>
                  <input className="signup-input" 
                          id="birthday-input" 
                          type="number"
                          placeholder='dd' 
                          onChange={(e) => {
                            setDd(e.currentTarget.value)
                            //setDateMessage(false);
                          }}
                          onBlur={(e) => handleBlur(e)}>
                  </input>
                  <input className="signup-input"
                          id="birthday-input"
                          type="number"
                          placeholder='yyyy' 
                          onChange={(e) => setYyyy(e.currentTarget.value)}
                          onBlur={(e) => handleBlur(e)}>
                  </input>
              </div>
          </div>
          {dateMessage && <p className="form-error">Date is not valid</p>}
          <div className="checkbox-container">
            <input className="checkbox" type="checkbox" onChange={(e)=>handleCheckChange(e)}></input>
            <label className="checkbox-label"> 
              <p>I certify that I agree to the Terms of Use and the information provided is accurate and that 
                  I am at least 21 years of age. 
              </p> 
            </label>
          </div>
        </form>
        <div className="button-section">
          {(email === '' ||
            name === '' ||
            userName === '' ||
            phone === false ||
            mm === '' ||
            dd === '' ||
            yyyy === '' ||
            !useTerms) ?
          (<Link to='/questions' className="disable-link">
            <button onClick={handleClick} id="disable-button">Submit</button>
          </Link>) : 
          (<Link to='/questions' onClick={handleClick} >
            <button  id="hero-button">Submit</button>
          </Link>)}
        </div>
    </div>
  );
}

export default SignUp;