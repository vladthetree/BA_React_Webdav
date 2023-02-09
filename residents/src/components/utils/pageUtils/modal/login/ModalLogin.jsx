import React, { useState,useEffect } from "react";
import Login from "./login.jsx";

const ModalLogin = ({userdata}) => {
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
				<div>
					<div >
					<Login onClose={handleCloseModal} />
					</div>
				</div>
			)}
		</div>
	);
};

export default ModalLogin;
