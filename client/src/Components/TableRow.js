import { useEffect, useState } from 'react';
import '../App';
import './Table.css';
import { getUsers } from '../utils/api';

function TableRow(props) {

    const columns = props.columns;
    const setLoading = props.setLoading;
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    //Get payment info
      //console.log('getting table rows....')
      setIsLoading(true);
      const timer = setTimeout(getData(), 3000)
      return () => clearTimeout(timer);
  }, [])

  const getData = async () => {

    const setData = (userData) => {
      setUserData(userData);
      setIsLoading(false);
    }

    const userData = await getUsers().then(data => {
      setData(data.sort((a,b) => {
        //console.log('Sorting Data...')
        if(Number(b.payout) > Number(a.payout)) return 1;
        if(Number(b.payout) < Number(a.payout)) return -1;
        if(b.score > a.score) return 1;
        if(b.score < a.score) return -1;
      }));
    });
    

  }

  //Check if users have signed up or if data is loading
  if(isLoading){
    return(
      <tr>
        <td colSpan={3}>Loading...</td>
      </tr>
    )
  }
  else if(userData.length === 0 ){
    return(
      <tr className="loading-row">
        <td colSpan={3}>Be the first to sign up!</td>
      </tr>
      
    )
  }

  return (
      <tbody>
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