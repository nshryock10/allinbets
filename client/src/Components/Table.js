import React from 'react';
import '../App';
import './Table.css';
import * as Icon from 'react-bootstrap-icons';
import TableRow from './TableRow';
import { useState, useEffect } from 'react';
import { searchUserName } from '../utils/utils';

function Table(props) {

    const data = props.data;
    const columns = [
        {label: 'User', accessor: 'username'},
        {label: 'Score', accessor: 'score'},
        {label: 'Payout', accessor: 'payout'}
    ]

    const [query, setQuery] = useState(null);
    const [searchResult, setSearchResult] = useState(null);

    useEffect(() => {
        if(query === null || query.length > 0){
          setSearchResult(searchUserName(query, data))
        }else{
          setSearchResult(null)
        }
      }, [query])

  return (
  <div className="table-container">
        <div className="table-top">
            <h3 className="pf">Live Leaderboard and Payouts</h3>
            <form className="search-form">
                <label className="pf form-label">Find your score</label>
                <div className="search-bar" id="table-search-bar">
                    <Icon.Search  className="search-icon"/>
                    <input className="text-input" placeholder="username" onChange={(e)=> {setQuery(e.target.value)}} ></input>
                </div>
            </form>
            
        </div>
        <table className="table">
            <thead>
                <tr className="table-row">
                    {columns.map(({ label, accessor })=> {
                        return <th key={accessor}>{label}</th>
                    }) 
                    }
                </tr>
            </thead>
            {(query !== null && searchResult !== null) && 
                <tbody>
                        <tr className="search-row">
                            <td>{searchResult[0]}</td>
                            <td>{searchResult[2]}</td>
                            <td>{`$${searchResult[1]}`}</td>                       
                        </tr>
                </tbody>
            }
            <TableRow columns={columns} />
        </table>
    </div>
  );
}

export default Table;