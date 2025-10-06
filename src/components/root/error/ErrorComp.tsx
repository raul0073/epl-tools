import React, { ReactNode } from 'react'

interface ErrorCompProps {
  reason: string
  action?: ReactNode
}

const ErrorComp: React.FC<ErrorCompProps> = ({ reason, action }) => {
  return (
   <div className='w-full px-6 py-12'>
     <div
      style={{
        padding: '1rem',
        border: '1px solid red',
        backgroundColor: '#ffe6e6',
        color: '#900',
        borderRadius: '0.5rem',
        fontFamily: 'sans-serif',
      }}
    >
      <strong>Error:</strong> {reason}
       <div className='action text-primary flex justify-end'>
      {action? action : null}
    </div>
    </div>
   
   </div>
  )
}

export default ErrorComp
