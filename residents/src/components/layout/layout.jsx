import React, { useEffect, useState } from "react";
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
	handleNewVideos,
}) => {
	const [showModal, setShowModal] = useState(true);
	const { height } = useWindowSize();
	const navbarhight = height / 25;
	const fontSize = height / 23;

	let newVideos = handleNewVideos(showModal);

	console.log("NEW VIDEOS ");
	console.log(newVideos);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setShowModal(true);
		}, 10000);

		return () => clearInterval(intervalId);
	}, []);

	const handleCloseModal = () => {
		setShowModal(false);
	};
	console.log(`SHOW MODAL IN LAYOUT ${showModal}`);
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
						<div className="navbar_left">
							{navbar_left.map((element) => (
								<div style={{ height: "100%" }}>{element}</div>
							))}
						</div>
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
				{showModal ? (
					<DefaultScreen
						handleCloseModal={handleCloseModal}
						newVideosAmount={newVideos}
					/>
				) : (
					<main className="layoutbody">{children}</main>
				)}
			</div>
		</div>
	);
};

export default Layout;
