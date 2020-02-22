import React, { useState, useEffect } from 'react'
import Login from "./Login.jsx"
import Jtray from "./Jtray.jsx"
import { getToken } from "./auth"



import { BrowserRouter as Router, Route } from "react-router-dom"

const Routes = () => {
    return (
        <Router>
            <Route exact path="/">
                {getToken() != 'undefined' && getToken() != null ? <Jtray /> : <Login />}
            </Route>
        </Router>
    )
}

export default Routes
