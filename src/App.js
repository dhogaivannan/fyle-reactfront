import logo from './logo.svg';
import './App.css';
import Table from 'rc-table';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
const LIMIT = 10;
function App() {
  const [city, setCity] = useState('Bangalore');
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [offset, setOffset] = useState(0); 
  const [count, setCount] = useState(0);
  const [favs, setFavs] = useState([])
  useEffect( () => {
    let f = localStorage.getItem('favs')
    if(f)
      setFavs(f)
  }, [])
  useEffect( (state) => {
    if(state !== favs)
      localStorage.setItem('favs', favs)
  }, [favs])
  useEffect((state) => {
    console.log(state)
    async function fetchData(query) {
      let response = await fetch("http://127.0.0.1:8000/api/branches/?q="+query+" "+city+ '&limit='+LIMIT +'&offset=' +offset);
      let jjson = await response.json()
      setData(jjson.results)
      setCount((jjson.count))
    }
    const delayDebounceFn = setTimeout(() => {
      if(searchTerm!=='')
      fetchData(searchTerm)
    }, 3000)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm,city])
  useEffect(() => {
    async function fetchData(query) {
        let response = await fetch("http://127.0.0.1:8000/api/branches/?q="+query+" "+city+ '&limit='+LIMIT +'&offset=' +offset);
        let jjson = await response.json()
        setData(jjson.results)
        setCount((jjson.count)) 
         
    }
    fetchData(searchTerm)
    },[offset])


  const apiURL = 'http://127.0.0.1:8000/api/branches/?q=' ;
  useEffect(() => {
    async function fetchData() {
      let response = await fetch(apiURL + city + '&limit='+LIMIT +'&offset=' +offset);
      let jjson = await response.json()
      setData(jjson.results)
      setCount((jjson.count))
    }
    fetchData()
  }, [city])
  const columns = [{
    title: 'IFSC',
    dataIndex: 'ifsc',
    key: 'ifsc',
    width: 40,
  },
  {
    title: 'Bank ID',
    dataIndex: 'bank_id',
    key: 'bank_id',
    width: 100,
  },
  {
    title: 'Branch',
    dataIndex: 'branch',
    key: 'branch',
    width: 50,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 300,
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    width: 50,
  },
  {
    title: 'District',
    dataIndex: 'district',
    key: 'district',
    width: 150,
  },
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
    width: 80,
  },
  {
    title: 'Favourites',
    key: 'fav',
    width: 50,
    render: (props) => { 
      let cond = favs.includes(props.ifsc)
      console.log(cond)
      return <input type="checkbox" checked={cond} onChange={(e)=>{
        setFavs([...favs, props.ifsc])
      }}/>
    }

  }
  ];

  return (
    <div className="App">
      <h1 className="title"> Bank Branches</h1>
      <div className="menu">
        <div className="menu-dropdown"></div>
        <select name="city" id="city"  onChange={(s)=>{
          setCity(s.target.value)
        }}>
          <option value="Bangalore"> Bangalore </option>
          <option value="Chennai"> Chennai </option>
          <option value="Delhi"> Delhi </option>
          <option value="Mumbai"> Mumbai </option>
          <option value="Kolkata"> Kolkata </option>
        </select>
        <div className="menu-search">
          <input type="text" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)}></input>
        </div>
      </div>
      <div className="table">
        <Table columns={columns} data={data} />
       
        <div className="nav-buttons">
          <button className="previous" onClick={back}> Previous</button>
          <button className="forward" onClick={next}> Forward </button>
        </div>


      </div>
    

    </div>
  );
  function search(e){
    console.log(e.target.value);
  }
  function next() {
    setOffset(offset+LIMIT)
  }
  function back(){
    setOffset(offset-LIMIT)
  }
  
  
}

export default App;
