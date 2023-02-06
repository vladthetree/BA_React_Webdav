import React, { useRef, useEffect, useState } from "react";
import "../pages/css/Interface.css";
import CurrentVideo from "./layout/current_Video.jsx";
import Administration from "./layout/administration.jsx";
import VideoSlide from "./layout/videoSlide.jsx";
import { Buffer } from "buffer";

const username = "test";
const password = "12345";
const targetUrl = "https://localhost:8443/remote.php/dav/files/test/";

const Interface = () => {
	const uper_leftRef = useRef({ size: { width: 0, height: 0 } });
	const uper_rightRef = useRef({ size: { width: 0, height: 0 } });
	const bottomRef = useRef({ size: { width: 0, height: 0 } });

	const [residents, setResidents] = useState(null);
	const [selectedResident, setSelectedResident] = useState(null);
	const [selectedResidentVideos, setSelectedResidentVideos] = useState(null);

	const updateSelectedResident = (newValue) => {
		setSelectedResident(newValue);
	};

	useEffect(() => {
		function handleResize() {
			uper_leftRef.current.size = uper_leftRef.current.getBoundingClientRect();
			uper_rightRef.current.size =
				uper_rightRef.current.getBoundingClientRect();
			bottomRef.current.size = bottomRef.current.getBoundingClientRect();
		}
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [uper_leftRef, uper_rightRef, bottomRef]);

	useEffect(() => {
		listResidents();
	}, []);

	const listResidents = async () => {
		try {
			const response = await fetch("/server/getResidents", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: username,
					password: password,
					targetUrl: targetUrl,
				}),
			});
			const content = await response.json();
			console.log(content);
			setResidents(content);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (selectedResident) {
			getResidentVideos();
		}
	}, [selectedResident]);

	const getResidentVideos = async () => {
		let result = [];
		try {
			const response = await fetch("/server/getResidentVideos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: username,
					password: password,
					targetUrl: targetUrl,
					resident: selectedResident,
				}),
			});
			const content = await response.json();
			content.forEach((item) => {
				let buffer = Buffer.from(item.buffer.data);
				const blob = new Blob([buffer], { type: "video/mp4" });
				const url = URL.createObjectURL(blob);
				result.push({ name: item.name, url: url });
			});
			setSelectedResidentVideos(result);
		} catch (error) {
			console.error(error);
		}
	};
	console.log("SelectedResidentVideos");
	console.log(selectedResidentVideos);

	return (
		<div
			style={{
				width: "100vw",
				height: "100vh",
				display: "grid",
				gridTemplateRows: "1fr 1fr",
			}}
		>
			<div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr" }}>
				<Administration
					selectedResident={selectedResident}
					updateSelectedResident={updateSelectedResident}
					residents={residents}
					ref={uper_leftRef}
				/>
				<CurrentVideo ref={uper_rightRef} />
			</div>

			<VideoSlide ref={bottomRef} videos={selectedResidentVideos} />
		</div>
	);
};

export default Interface;
