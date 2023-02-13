import React, { useState,useEffect } from "react";
import Login from "./login.jsx";

const ModalLogin = ({userdata}) => {
	console.log("INSIDE MODALLOGIN")
	console.log(userdata)
	
	return (
		<div>
				<div>
					<div >
					{!userdata ? <Login /> : null}
					</div>
				</div>
			
		</div>
	);
};

export default ModalLogin;
