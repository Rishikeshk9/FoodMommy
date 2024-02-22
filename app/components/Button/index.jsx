import React from 'react'

function Button({ type,handleAddItem,onClick,text }) {
  // Determine the button's className based on the type prop
  let className = "btn";
  if (type === "primary") {
    className += "-primary";
  }
  else if (type === "secondary") {
    className += "-secondary";
  }
  else if (type === "success") {
    className += "-success";
  }
  else if (type === "error") {
    className += "-error";
  }
  else if (type === "neutral") {
    className += "-neutral";
  }
  else if (type === "ghost") {
    className += "-ghost";
  }

  else if (type === "info") {
    className += "-info";
  }
  // Render the button
  return <button className={`btn ${className}      `} onClick={onClick} >{text}</button>;
}

export default Button;
