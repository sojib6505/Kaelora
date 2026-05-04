import React from 'react'
import { Link } from 'react-router'
import logo from '../assets/logo.png'

export default function Logo() {
  return (
   <Link to='/' className=''>
        <img src={logo} alt="Kaelora"  className='w-10 h-10'/>
   </Link>
  )
}
