import React, { useState } from 'react';
import './Login.css'
import PropTypes from 'prop-types';
import { loginUser } from '../utils/api';

function Login({setToken}) {

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [success, setSuccess] = useState(true)

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            username: userName,
            password: password
        });
        if(token !=='incorrect'){
        setToken(token)
        }else{
            setSuccess(false)
        }
    }

    return (
    <div className="login-wrapper">
        <h1>Please login</h1>
        <form onSubmit={handleSubmit} >
            <label>
                <p>Username:</p>
                <input type="text" onChange={e => setUserName(e.target.value)} />
            </label>
            <label>
                <p>Password:</p>
                <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            <div>
                <button id="login-button" type="submit" >Sign In</button>
            </div>
            {!success && <div>Incorrect username and/or password</div>}
        </form>
    </div>

    );
}

Login.propTypes ={
    setToken: PropTypes.func.isRequired
}

export default Login;