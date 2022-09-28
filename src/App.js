
import './App.css';
import React, { Component } from 'react'
import Cell from './game/Cell'
import Game from './game/Game'

import { useState, useCallback } from "react"


document.addEventListener('contextmenu', event => event.preventDefault());

function Parent() {
  let [arr, setArray] = useState([1,2,3])

  function childCallback(event) {
    console.log("Child wants you! " + event)
  }

  return(
    <div>
      {arr.map(val => <Child num={val}
        handleOnClick={childCallback}
        key={val}/>)}
    </div>
  )
}

function Child(props) {
  let [number, setNumber] = useState(props.num)
  let handleOnClick = props.handleOnClick
  return(
    <button data-number={number}
      onClick={(e)=>handleOnClick(number)}>
      Child {number}
    </button>
  )
}

function App() {

  return (
    <div className="App" >
      <Game />
    </div>
  );
}

export default App;
