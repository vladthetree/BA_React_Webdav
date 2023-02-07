import React, { forwardRef, useEffect, useState, useRef } from "react";
import { Dropdown } from "./utils/components/dropDown.jsx";
import "../css/administrator.css";
import { useWindowSize } from "react-use";

const Administration = ({selectedResident,updateSelectedResident,residents }) => {


	return (
		<div >
			
		</div>
	)

	// return (
	// 	<div className="box administration">
	// 		<div className="container-administration">
	// 			<div>ROW1up</div>
	// 			<div className="container-administration-2rd-row" >
	// 				<div>1</div>
	// 				<Dropdown
	// 					selectedResident={selectedResident}
	// 					residents={residents}
	// 					updateSelectedResident={updateSelectedResident}
	// 				/>
	// 			</div>
	// 			<div className="container-administration-3rd-row">
	// 				<div className="admin-box ad-box-1">ROW3-COL1</div>
	// 				<div className="admin-box ad-box-2">ROW3-COL2</div>
	// 				<div className="admin-box ad-box-3">ROW3-COL3</div>
	// 				<div className="admin-box ad-box-4">ROW3-COL4</div>
	// 			</div>
	// 		</div>
	// 	</div>
	// );
};

export default Administration;
