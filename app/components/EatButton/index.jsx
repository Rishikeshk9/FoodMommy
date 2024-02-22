import PropTypes from "prop-types";
import React, { useState } from "react";
import { useReducer } from "react";

  const EatButton = ({ property1, className, text }) => {
    const [selected,setSelected] = useState(false);

  return (
    <div onClick={()=>setSelected(!selected)} className={`${selected?'btn-primary':'btn-active'} btn text-xl btn-wide btn-lg`}> 
    {!selected?"Vote to Eat":"Eating Today "}
    </div>
  );
};
 

export default EatButton;