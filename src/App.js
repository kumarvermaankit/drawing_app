import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Board from "./board"
import MultiCanvas from "./multicanvas"
import "./App.css"
function App() {
  return (
    <div>
      <Router>
        <Route exact path="/">
          <Board />
        </Route>
        <Route exact path="/multi">
          <MultiCanvas />
        </Route>
      </Router>
    </div>
  )
}

export default App