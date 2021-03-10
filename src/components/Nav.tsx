import React from 'react'

import { Link } from 'react-router-dom'

export default class Nav extends React.Component {
    render () {
        return (
        <div className="nav-wrapper">
            <div className="navbar">
                <Link to="/uitleg"><div className="nav-item">Uitleg</div></Link>
                <Link to="/"><div className="nav-item">Home</div></Link>
                <Link to="/downloads"><div className="nav-item">Downloads</div></Link>
            </div>
        </div>)
    }
}