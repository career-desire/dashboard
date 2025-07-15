import React from 'react'
import "../styles/NotFoundPage.css"
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className='not-found-page'>
      <div className="not-found-text">
        <h1 className='not-found-number'>404</h1>
        <h3>page not found</h3>
      </div>
      <Link to="/"><p className='not-found-btn'>Back to main page</p></Link>
    </div>
  )
}

export default NotFoundPage