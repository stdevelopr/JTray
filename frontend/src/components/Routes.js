import React from 'react'
import Login from "./Login.jsx"
import Jtray from "./Jtray.jsx"
import { isAuthenticated } from "./auth"



import { BrowserRouter as Router, Route } from "react-router-dom"

const PrivateRoute = ({ component }) => {
    return (
        isAuthenticated() ?
            <Route component={component} />
            :
            <Redirect to='/login' />
    )
}


const Routes = () => {
    return (
        <Router>
            <Route path="/login" exact component={Login} />
            <PrivateRoute path="/" exact component={Jtray} />
        </Router>
    )
}

export default Routes
