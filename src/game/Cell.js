import '../App.css';
import React, { Component } from 'react'
import { useState } from 'react'
import GameData from './GameData'

function Cell(props) {
    let state = {
        xIndex: props.x,
        yIndex: props.y,
        value: props.value,
        stateClass: props.stateClass,
        parentHandleOnClick: props.parentHandleOnClick,
        parentHandleOnContextMenu: props.parentHandleOnContextMenu
    }
    let [rerender, setRerender] = useState(props.rerender);


    function handleOnClick() {
        state.parentHandleOnClick(state) //callback to parent. Parent handles all logic
        setRerender(!rerender);
    }

    function handleOnContextMenu() {
        state.parentHandleOnContextMenu(state)
    }

    return (
        <div className={state.stateClass}
            onClick={handleOnClick}
            onContextMenu={handleOnContextMenu}
        >
            {((props.stateClass=="revealed"
                || props.stateClass=="gameOver")
                && props.value != 0 ) ? 
                ((props.value==-1) ? '*' : props.value) : '\u200D'}
        </div>
    );
}

export default Cell