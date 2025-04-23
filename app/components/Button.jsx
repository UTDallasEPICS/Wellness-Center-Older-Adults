import React from 'react'

function Button({text}){
  return(
    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
    {text}
  </button>
  )
}

export default Button