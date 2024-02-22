import React from 'react'

function Badge({name,onClick}) {
  return (
    <div><button className="btn btn-outline">
    {name}
    <div onClick={()=>onClick(name)} className="badge">x</div>
  </button>  </div>
  )
}

export default Badge