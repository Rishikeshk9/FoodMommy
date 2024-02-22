import React from 'react'

function DropDown({options,setSelected,selected}) {
  return (<>
    <select onChange={(e)=>setSelected(e.target.value)} value={selected} className="select select-bordered w-max  focus:ring-0 focus:outline-none">
        {
            options.map((item,index)=>{
                return( 
                    <option key={index}>{item}</option>
                    
                 )
            })
        } 
  
</select></>
  )
}

export default DropDown