import React, { useState, useEffect, useRef } from "react";
import "../../../css/utilsStyle.css";
import { Popup } from "./dropdown/popup.jsx";



export const Dropdown = ({residents, updateSelectedResident,selectedResident}) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<div className="dropdown-container">
				<div className="dropdown-selected">{selectedResident}</div>
				<button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
					Open Popup
				</button>
			</div>
			{isOpen && (
				<Popup open={isOpen} onClose={() => setIsOpen(false)}>
					<ul>
						{residents.map((index) => (
							<li
								className="popup-listValues"
								key={index}
								onClick={() => updateSelectedResident(index)}
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


