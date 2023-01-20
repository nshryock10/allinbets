import React from 'react';
import { GraphDown } from 'react-bootstrap-icons';

function ProgressBar({progress}) {
    const bgcolor = 'var(--green)';
    const Parentdiv = { 
        height: '17px', 
        width: '85%', 
        backgroundColor: 'whitesmoke', 
        borderRadius: 40, 
        margin: 25,
        position: '-webkit-sticky',
        position: 'sticky',
        bottom: '10px',
      } 
      const Childdiv = { 
        height: '100%', 
        width: `${progress}%`, 
        backgroundColor: bgcolor, 
        borderRadius:10, 
        textAlign: 'right'
      } 
      
      const progresstext = { 
        padding: 10, 
        color: 'black', 
        fontWeight: 900 
      } 

  return (
    <div style={Parentdiv}> 

      <div style={Childdiv}> 

        <span style={progresstext}>{`${progress}%`}</span> 

      </div> 

    </div> 
    
  );
}

export default ProgressBar;