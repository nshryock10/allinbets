import { useEffect, useState } from 'react';
import '../App';
import './Table.css';
import { getUsers } from '../utils/api';

function TableRow(props) {

    const columns = props.columns;
    const [userData, setUserData] = useState([]);
    
  useEffect(() => {
    //Get payment info
      getData();
  }, [])

  const getData = async () => {

    const setData = (userData) => {
      setUserData(userData);
    }

    const userData = await getUsers();
    setData(userData.sort((a,b) => {
      if(Number(b.payout) > Number(a.payout)) return 1;
      if(Number(b.payout) < Number(a.payout)) return -1;
      if(b.score > a.score) return 1;
      if(b.score < a.score) return -1;
    }));
  }
  return (
      
      
      <tbody>
        {userData.length === 0 && <tr>Loading....</tr>}

        {userData.length > 0 && userData.map((user) => {
          //Check if user completed payment before displaying
          if(user.paid){
          return (
            <tr key={user.id}>
              {columns.map(({ accessor }) => {
            
              let tData = '-';
              if(accessor === 'username'){
                tData = user.username;
              }else if(accessor === 'score'){
                tData = user.score;
              }else if(accessor === 'payout'){
                tData = `$${Number(user.payout).toFixed(2)}`;
              }

              return <td key={accessor}>{tData}</td>;
              
            })}

        </tr>);}
        })}

      </tbody>
  );
}

export default TableRow;