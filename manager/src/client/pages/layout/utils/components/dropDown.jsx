import React, { useState, useEffect, useRef } from "react";
import "../../../css/utilsStyle.css";
import { Popup } from "./dropdown/popup";

export const Dropdown = ({ array, sizeDropDownRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (sizeDropDownRef && sizeDropDownRef.current) {
      setSize(sizeDropDownRef.current.getBoundingClientRect());
    } else {
      setSize({ width: 250, height: 150 });
    }
  }, [sizeDropDownRef]);

  const handleListItemClick = (index) => {
    setSelected(index);
  }
  return (
    <div>
      <div className="dropdown-container">
        <div className="dropdown-selected">{selected}</div>
        <button classname="dropdown-button" onClick={() => setIsOpen(!isOpen)}>Open Popup</button>
      </div>
      {isOpen && (
        <Popup  open={isOpen}  onClose={() => setIsOpen(false)}>
          <ul>
            {array.slice(0, 10).map((index) => (
              <li className="popup-listValues"
                key={index}
                onClick={() => handleListItemClick(index)}
              >
                {index}
              </li>
            ))}
          </ul>
        </Popup>
)}
    </div>
  );
};
