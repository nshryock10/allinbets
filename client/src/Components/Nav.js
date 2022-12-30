import '../App';
import './Nav.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { IoMan, IoFlameSharp } from "react-icons/io5";
import classNames from 'classnames';

function Nav() {

  const navStyle = {
    color: 'white',
  }

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const active = classNames('nav-button', {
    open: mobileNavOpen,
  })

  const displayMobileNav = classNames('nav-links2', {
    open: mobileNavOpen,
  })

  return (
    <nav>
      <div className="logo-container">
        <div className="icon-container">
          <IoFlameSharp className="logo-icon"/>
          <IoMan className="logo-icon" />
        </div>
        <h3>HotGuyPropBets</h3>
      </div>
      <div className="mobile-nav">
        <span >
          <button
          className={active}
            onClick={() => {
              setMobileNavOpen((mobileNavOpen) => !mobileNavOpen)
            }}
          >
            <div className="bar-one"></div>
            <div className="bar-two" ></div>
            <div className="bar-three" ></div>
          </button>
        </span>
        <ul className={displayMobileNav} >
          <Link className="nav-item" style={navStyle} to='/'
            onClick={() => {
            setMobileNavOpen((mobileNavOpen) => !mobileNavOpen)
            }} 
          >
            <li className="nav-item">Home</li>
          </Link>
          <Link className="nav-item" style={navStyle} to='signup'
            onClick={() => {
              setMobileNavOpen((mobileNavOpen) => !mobileNavOpen)
              }}
          >
            <li className="nav-item" >Sign Up</li>
          </Link>
          <Link className="nav-item" style={navStyle} to='answers'
            onClick={() => {
              setMobileNavOpen((mobileNavOpen) => !mobileNavOpen)
              }}
          >
            <li className="nav-item" >View Answers</li>
          </Link>
        </ul>
      </div>
      
    </nav>
  );
}

export default Nav;