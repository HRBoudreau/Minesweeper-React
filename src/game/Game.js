import '../App.css';
import React, { Component } from 'react'
import Cell from "./Cell"
import { useState } from "react"
import { flushSync } from 'react-dom';
import GameData from './GameData'
import gameData from './GameData';

function Game(props) {

    // const [gameData.rows, setgameData.rows] = useState(12)
    // const [gameData.columns, setgameData.columns] = useState(12)
    // const [gameData.numberOfMines, setgameData.numberOfMines] = useState(10)
    let [rerender, setRerender] = useState(false);
    let [interfaceText, setinterfaceText] = useState("");
    let [difficulty, setDifficulty] = useState("Medium \u25BC");


    function startGame() {
        // setgameData.rows(gameData.rows + 2)       // margain of 1 around border
        // setgameData.columns(gameData.columns + 2) //so I don't need to check for out of bounds array access
        // setgameData.numberOfMines(gameData.numberOfMines)
        setinterfaceText("")
        let rows = gameData.rows +2
        let columns = gameData.columns +2


        let temp = []
        for ( let i = 0; i < rows; ++i ) {
            const currRow = []
            for ( let j = 0; j < columns; ++j ) {
                currRow[currRow.length] = [0,"hidden",i-1,j-1];
            }
            temp = [...temp, currRow]
        }

        placeMines(temp,rows,columns)

        let retBoard = []
        for( let i = 1; i < rows-1; ++i ){
            const currRow = []
            for( let j = 1; j < columns-1; ++j ) {
                currRow[currRow.length] = temp[i][j];
            }
            retBoard=[...retBoard, currRow]
        }
        gameData.board=retBoard
        gameData.nonMinesLeft=(gameData.rows*gameData.columns)-gameData.numberOfMines
        setRerender(!rerender);
    }

    function setBoardValue(temp,rows,columns) {
        for ( let i = 1; i < (rows-1); ++i ) {
            for ( let j = 1; j < (columns-1); ++j ) {
                temp[i][j][0] = setCellValue(temp,i,j)
            }
        }
    }

    function setCellValue( temp,rowI, columnI ) {
        if ( temp[rowI][columnI][0] == -1 )
            return -1

        let value = 0
        if ( -1 == temp[rowI+1][columnI-1][0] )
            value = value + 1
        if ( -1 == temp[rowI+1][columnI][0] )
            value = value + 1
        if ( -1 == temp[rowI+1][columnI+1][0] )
            value = value + 1
        if ( -1 == temp[rowI][columnI+1][0] )
            value = value + 1
        if ( -1 == temp[rowI-1][columnI+1][0] )
            value = value + 1
        if ( -1 == temp[rowI-1][columnI][0] )
            value = value + 1
        if ( -1 == temp[rowI-1][columnI-1][0] )
            value = value + 1
        if ( -1 == temp[rowI][columnI-1][0] )
            value = value + 1

        return value
    }

    function placeMines(temp,rows,columns) {
        let minesLeft = gameData.numberOfMines
        let chanceRow = 0
        let chanceColumn = 0
        while( minesLeft > 0 ) {
            chanceRow = parseInt((Math.random()*(rows-2))+1)
            chanceColumn = parseInt((Math.random()*(columns-2))+1)
            if ( temp[chanceRow][chanceColumn][0] != -1 && 
                temp[chanceRow][chanceColumn][0] < 5 ) {
                    temp[chanceRow][chanceColumn][0] = -1
                minesLeft = minesLeft - 1
            }
            setBoardValue(temp,rows,columns)
        }
    }

    function drawTextBoard() {
        console.log("BOARD START")
        for ( let i = 1; i < (gameData.rows-1); ++i ) {
            let strng = ""
            for ( let j = 1; j < (gameData.columns-1); ++j ) {
                strng = strng + " " + gameData.board[i][j][0]
            }
            console.log(strng)
        }
        console.log("BOARD END")
    }

    function handleChildOnClick(state) {
        // check initial click - make sure it reveals 0
        if ( gameData.nonMinesLeft == (gameData.rows*gameData.columns)-gameData.numberOfMines 
            && state.value!=0 ) {
            while ( gameData.board[state.yIndex][state.xIndex][0] != 0 ) {
                startGame()
            }
            let newState = state
            newState.value = 0
            handleChildOnClick(newState)
            return
        }

        if ( state.stateClass=="hidden")
        {
            gameData.board[state.yIndex][state.xIndex][1]="revealed"
            if ( state.value== -1 ) { // you hit a mine!
                iterateAllCells( (r,c)=> {
                    if ( gameData.board[r][c][0]==-1 ) {
                        gameData.board[r][c][1]="revealed"
                    }
                    else {
                        gameData.board[r][c][1]="gameOver"
                    }
                 } )
                setinterfaceText("GAME OVER")
            }
            else {
                gameData.nonMinesLeft = gameData.nonMinesLeft - 1
                if ( state.value == 0 )
                    floodReveal(state.yIndex,state.xIndex)
            }

            if(gameData.nonMinesLeft==0) {
                iterateAllCells( (r,c)=> {
                    gameData.board[r][c][1]="revealed"
                } )
                setinterfaceText("YOU'VE WON!")
            }
        }

        setRerender(!rerender);
    }

    function floodReveal(rowI,columnI) {

        if ( rowI+1 < gameData.rows
            && gameData.board[rowI+1][columnI][1] == "hidden" ) {
            gameData.nonMinesLeft = gameData.nonMinesLeft - 1
            gameData.board[rowI+1][columnI][1] = "revealed"
            if ( gameData.board[rowI+1][columnI][0] == 0 )
                floodReveal(rowI+1,columnI)
        }

        if ( rowI+1 < gameData.rows && columnI-1 > -1
            && gameData.board[rowI+1][columnI-1][1] == "hidden" ) {
                gameData.nonMinesLeft = gameData.nonMinesLeft - 1
            gameData.board[rowI+1][columnI-1][1] = "revealed"
            if ( gameData.board[rowI+1][columnI-1][0] == 0 )
                floodReveal(rowI+1,columnI-1)
        }

        if ( rowI+1 < gameData.rows && columnI+1 < gameData.columns
            && gameData.board[rowI+1][columnI+1][1] == "hidden" ) {
                gameData.nonMinesLeft = gameData.nonMinesLeft - 1
            gameData.board[rowI+1][columnI+1][1] = "revealed"
            if ( gameData.board[rowI+1][columnI+1][0] == 0 )
                floodReveal(rowI+1,columnI+1)
        }

        if ( columnI-1 > -1
            && gameData.board[rowI][columnI-1][1] == "hidden" ) {
                gameData.nonMinesLeft = gameData.nonMinesLeft - 1
            gameData.board[rowI][columnI-1][1] = "revealed"
            if ( gameData.board[rowI][columnI-1][0] == 0 )
                floodReveal(rowI,columnI-1)
        }

        if ( columnI+1 < gameData.columns 
            && gameData.board[rowI][columnI+1][1] == "hidden" ) {
                gameData.nonMinesLeft = gameData.nonMinesLeft - 1
            gameData.board[rowI][columnI+1][1] = "revealed"
            if ( gameData.board[rowI][columnI+1][0] == 0 )
                floodReveal(rowI,columnI+1)
        }

        if ( rowI-1 > -1 
            && gameData.board[rowI-1][columnI][1] == "hidden" ) {
                gameData.nonMinesLeft = gameData.nonMinesLeft - 1
            gameData.board[rowI-1][columnI][1] = "revealed"
            if ( gameData.board[rowI-1][columnI][0] == 0 )
                floodReveal(rowI-1,columnI)
        }

        if ( rowI-1 > -1 && columnI-1 > -1 
            && gameData.board[rowI-1][columnI-1][1] == "hidden" ) {
                gameData.nonMinesLeft = gameData.nonMinesLeft - 1
            gameData.board[rowI-1][columnI-1][1] = "revealed"
            if ( gameData.board[rowI-1][columnI-1][0] == 0 )
                floodReveal(rowI-1,columnI-1)
        }

        if ( rowI-1 > -1 && columnI+1 < gameData.columns
            && gameData.board[rowI-1][columnI+1][1] == "hidden" ) {
                gameData.nonMinesLeft = gameData.nonMinesLeft - 1
            gameData.board[rowI-1][columnI+1][1] = "revealed"
            if ( gameData.board[rowI-1][columnI+1][0] == 0 )
                floodReveal(rowI-1,columnI+1)
        }


    }

    function handleChildOnContextMenu(state) {
        if ( state.stateClass=="hidden")
        {gameData.board[state.yIndex][state.xIndex][1]="flag"
        }
        else if ( state.stateClass=="flag")
        {gameData.board[state.yIndex][state.xIndex][1]="hidden"
        }

        setRerender(!rerender);
    }

    function iterateAllCells(func) {
        for( let r = 0; r < gameData.rows; ++r ) {
            for( let c = 0; c < gameData.columns; ++c ) {
                func(r,c)
            }
        }
    }

    function easy() {
        gameData.rows = 8
        gameData.columns = 10
        gameData.numberOfMines = 10
        console.log("clicked easy")
        setDifficulty("Easy \u25BC")
        startGame()
    }

    function medium() {
        gameData.rows = 15
        gameData.columns = 15
        gameData.numberOfMines = 40
        console.log("clicked medium")
        setDifficulty("Medium \u25BC")
        startGame()
    }

    function hard() {
        gameData.rows = 20
        gameData.columns = 20
        gameData.numberOfMines = 100
        setDifficulty("Hard \u25BC")
        startGame()
    }

    return(
    <div className="game">
        <nav className="nav">
            <div className="navElements"></div>
            <div className="dropdown">
                <button className="dropdown-button"> 
                    {difficulty}
                </button>
                <div className="dropdown-menu">
                    <a onClick={easy} className="dropdown-item">
                        Easy
                    </a>
                    <a onClick={medium} className="dropdown-item">
                        Medium
                    </a>
                    <a onClick={hard} className="dropdown-item">
                        Hard
                    </a>
                </div>
            </div>
            <button onClick={startGame} className="button"> 
                    Start
            </button>
            <div className="navElements"></div>
        </nav>
        <div className="body">
            <a className="fillElement"></a>
            <div className="board">
                {gameData.board.map( val => (
                    <div> 
                        {val.map(cell=><Cell value={cell[0]}
                            stateClass={cell[1]}
                            y={cell[2]}
                            x={cell[3]}
                            parentHandleOnClick={handleChildOnClick}
                            parentHandleOnContextMenu={handleChildOnContextMenu}
                            />)} 
                    </div>
                ))
                }
            </div>
            <div className="bodyElements"></div>
        </div>
        <footer className="footer">
            <div className="bodyElements"></div>
            <h1 className="interText">{interfaceText}</h1>
            <div className="bodyElements"></div>
        </footer>
    </div>
    )
}

export default Game