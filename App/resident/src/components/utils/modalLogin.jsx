import React, { useState,useEffect } from "react";
import "../style/modal.css";
import Login from "../../routes/login.jsx";

const Modal = ({userdata}) => {
	const [showModal, setShowModal] = useState(!userdata);

	const handleCloseModal = () => {
	  setShowModal(false);
	};
	useEffect(() => {
		if (userdata) {
			const turnOfModal = setInterval(() => {
				setShowModal(false);
			}, 100);
			return () => clearInterval(turnOfModal);
		}
		
	}, [userdata]);

	return (
		<div>
			{showModal && (
				<div className="modal-overlay">
					<div className="modal-content">
					<Login onClose={handleCloseModal} />
					</div>
				</div>
			)}
		</div>
	);
};

export default Modal;
