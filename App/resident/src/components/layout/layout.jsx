import React, { useEffect, useState, useRef } from "react";
import "../style/layout.css";
import { useWindowSize } from "react-use";
import DefaultScreen from "../utils/pageUtils/modal/defaultScreenElement/DefaultScreen.jsx";
import ModalLogin from "../utils/pageUtils/modal/login/ModalLogin.jsx";

const Layout = ({
	navbar_left,
	navbar_middle,
	navbar_right,
	children,
	userdata,
	isActive,
	setIsActive,
	videoAmount,
	showModal,
	setShowModal
}) => {
	

	const { height } = useWindowSize();
	const navbarhight = height / 25;
	const fontSize = height / 23;

	console.log("NEW VIDEOS ");
	console.log(videoAmount);


	const handleCloseModal = () => {
		setIsActive(true);
	  };
	  
	  useEffect(() => {
		console.log("isActive changed:", isActive);
	  }, [isActive]);
	return !userdata ? (
		<ModalLogin />
	) : (
		<div className="layout">
			<header className="layoutheader">
				<nav
					className="navbar"
					style={{
						height: navbarhight,
					}}
				>
					<div className="navbar_left_wrapper">
						<div className="navbar_left">{navbar_left}</div>
					</div>
					<div className="navbar_middle" style={{ fontSize: `${fontSize}px` }}>
						{navbar_middle}
					</div>
					<div className="navbar_left_wrapper">
						<div className="navbar_left">{navbar_right}</div>
					</div>
				</nav>
			</header>
			<div style={{ height: height - navbarhight }}>
				{!isActive ? (
					<DefaultScreen
						handleCloseModal={handleCloseModal}
						newVideosAmount={videoAmount}
					/>
				) : (
					<main className="layoutbody">{children}</main>
				)}
			</div>
		</div>
	);
};

export default Layout;
