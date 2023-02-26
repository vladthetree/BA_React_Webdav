import React, { useState } from "react";
import "../../../css/dropdownListButton.css"

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
    <div className="dropdown-container">
      <button className="dropdown-button-residents" onClick={handleClick}>{choosen}</button>
      {showList && (
        <ul className="dropdown-list">
          {residents.map((item, index) => (
            <li className="dropdown-list-item" key={index} onClick={() => {
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
