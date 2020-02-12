import React from 'react'
import BoardHeader from "./BoardHeader.jsx"
import Header from "./Header.jsx"
import { TrayBoard } from "./TrayBoard.jsx";

const Jtray = () => {
    return (
        <div>
            <Header />
            <BoardHeader />
            <TrayBoard />
        </div>
    )
}

export default Jtray
