import React from 'react'

function Table({data}) {
  return (
     <div className="overflow-x-auto">
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th>
            <label>
              <input type="checkbox" className="checkbox" />
            </label>
          </th>
          <th>Food</th>
          <th>Meal</th>
{/*           
          <th></th> */}
        </tr>
      </thead>
      <tbody>
        {/* row 1 */}
        {data.map((item,index)=>{
          return  <tr key={index}>
          <th>
            <label>
              <input type="checkbox" className="checkbox" />
            </label>
          </th>
          <td>
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="mask mask-squircle w-12 h-12">
                  <img src="/tailwind-css-component-profile-2@56w.png" alt="Avatar Tailwind CSS Component" />
                </div>
              </div>
              <div>
                <div className="font-bold">{item.fooditems.food_name}</div>
                <div className="text-sm opacity-50 hidden">United States</div>
              </div>
            </div>
          </td>
          <td>
          {item.meal_type}
            <br/>
            <span className="badge badge-ghost badge-sm">{item.time_of_week}</span>
          </td>
          <td></td>
          {/* <th>
            <button className="btn btn-ghost btn-xs">details</button>
          </th> */}
        </tr>

        })}
        
        
      </tbody>
      {/* foot */}
      <tfoot>
        <tr>
          <th></th>
          <th>Food</th>
          <th>Meal</th>
         
          {/* <th></th> */}
        </tr>
      </tfoot>
      
    </table>
  </div> 
  )
}

export default Table