import React from 'react'
import { Link } from 'react-router'
import logo from '../assets/logo.png'

export default function Logo() {
  return (
   <Link to='/' className='bg-black/90 p-2 rounded-md'>
        <img src={logo} alt="Kaelora"  className='w-15 h-10'/>
   </Link>
  )
}
