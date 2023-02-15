import React, { useState, useEffect } from "react";
import Login from "./login.jsx";

const ModalLogin = ({ userdata }) => {
	console.log("INSIDE MODALLOGIN");
	console.log(userdata);

	return (
		<div>
			<Login/>
		</div>
	);
};

export default ModalLogin;
