import React, { useState } from "react";

function DropdownList({residents,updateSelectedResident}) {
  const [showList, setShowList] = useState(false);
  const [choosen, setChoosen] = useState("nothing choosen");



  const handleClick = () => {
    setShowList(!showList);
  };

  const handleOptionClick = (value) => { 
    setShowList(false);
  };

  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center",backgroundColor: "blue", width: "100%", height: "100%", position: "relative"}}>
      <button style={{height:"50%", width:"50%"}} onClick={handleClick}>{choosen}</button>
      {showList && (
        <ul style={{ backgroundColor: "white", width: "15%", position: "absolute", top: 0, margin:"20px"}}>
          {residents.map((item, index) => (
            <li key={index} onClick={() => {
              handleOptionClick(item),
              updateSelectedResident(item)
              setChoosen(item)
            }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropdownList;
