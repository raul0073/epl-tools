import React from 'react'
import { TbRectangleVerticalFilled } from 'react-icons/tb'

function SubIcon() {
  return (
    <div className='relative'>
      <TbRectangleVerticalFilled className="fill-red-600 absolute left-1/2 -translate-x-1/2"/>
      <TbRectangleVerticalFilled className="fill-yellow-400 absolute left-1/3 -translate-x-1/3"/>  
    </div>
  )
}

export default SubIcon
