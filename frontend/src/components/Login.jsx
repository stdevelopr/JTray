import React from 'react'
import { isAuthenticated } from "./auth"
import { Redirect } from "react-router-dom"

export default function Login() {
    return (
        isAuthenticated() ?
            <Redirect to='/' />
            :
            <div>
                <h1>Login</h1>
            </div>
    )
}
