import React from "react";
import "../style/layout.css";
import { useWindowSize } from "react-use";

const Layout = ({ navbar_left, navbar_middle, navbar_right, children }) => {
	const { width, height } = useWindowSize();
	const navbarhight = height / 25;
	const fontSize = height / 23;
	return (
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
						<div className="navbar_left">
							{navbar_right}
						</div>
					</div>
				</nav>
			</header>
			<main className="layoutbody">{children}</main>
		</div>
	);
};

export default Layout;
