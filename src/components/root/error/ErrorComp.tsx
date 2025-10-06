import React from 'react'

interface ErrorCompProps {
  reason: string
}

const ErrorComp: React.FC<ErrorCompProps> = ({ reason }) => {
  return (
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
    </div>
  )
}

export default ErrorComp
