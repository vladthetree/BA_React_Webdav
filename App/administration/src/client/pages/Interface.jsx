import React, { useRef, useEffect, useState } from "react";
import "./css/Interface.css";
import CurrentVideo from "./layout/current_Video.jsx";
import Administration from "./layout/administration.jsx";
import VideoSlide from "./layout/videoSlide.jsx";
import { Buffer } from "buffer";
import { useWindowSize } from "react-use";
import DropdownList from "./layout/utils/components/dropdownList.jsx";

const username = "test";
const password = "12345";
const targetUrl = "http://localhost:8777/remote.php/dav/files/test/";

const Interface = () => {
	const [residents, setResidents] = useState(null);
	const [selectedResident, setSelectedResident] = useState(null);
	const [selectedResidentVideos, setSelectedResidentVideos] = useState([]);
	const [selectedVideos, setSelectedVideos] = useState([]);
	const videoArrayRef = useRef([]);

	const handleSelectVideos = (videoNames) => {
		setSelectedVideos((prevSelectedVideos) => {
			let updatedSelectedVideos = [];
			if (prevSelectedVideos) {
				if (!prevSelectedVideos.includes(videoNames)) {
					updatedSelectedVideos = [...prevSelectedVideos, videoNames];
				} else {
					updatedSelectedVideos = prevSelectedVideos.filter((selectedVideo) => selectedVideo !== videoNames);
				}
			} else {
				updatedSelectedVideos = [videoNames];
			}
			return updatedSelectedVideos;
		});
	};





	const updateSelectedResident = (newValue) => {
		setSelectedResident(newValue);
	};

	useEffect(() => {
		listResidents();
	}, []);

	const listResidents = async () => {
		try {
			const response = await fetch("http://localhost:8081/server/getResidents", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: username,
					password: password,
					targetUrl: targetUrl,
				}),
			});
			const content = await response.json();
			setResidents(content);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (selectedResident && selectedResident !== "check pls") {
			streamVideo();
		}
	}, [selectedResident]);



	const streamVideo = async () => {
		const message = {
			type: "userdata",
			data: {
				username: "test",
				password: "12345",
				targetUrl: "http://localhost:8777/remote.php/dav/files/test/",
				resident: "Mueller",
			},
		};

		const socket = new WebSocket("ws://localhost:8051");


		socket.addEventListener("open", () => {
			socket.send(JSON.stringify(message));
		});

		socket.addEventListener("message", (event) => {
			const data = event.data;

			if (typeof data === "string") {
				const messageObject = JSON.parse(data);

				if (messageObject.type === "video") {
					const { fileName, bufferdata, packetId } = messageObject.data;

					let videoObject = videoArrayRef.current.find((file) => file.fileName === fileName);

					if (!videoObject) {
						videoObject = { fileName, packets: [] };
						videoArrayRef.current.push(videoObject);
					}


					const existingPacket = videoObject.packets.find((packet) => packet.packetId === packetId);
					if (!existingPacket) {
						videoObject.packets.push({ packetId, data: bufferdata });
					}


					if (videoObject.packets.length === bufferdata.totalPackets) {
						let videoBlob = null;
						for (let i = 0; i < videoObject.packets.length; i++) {
							if (!videoBlob) {
								videoBlob = new Blob([videoObject.packets[i].data.data]);
							} else {
								videoBlob = new Blob([videoBlob, videoObject.packets[i].data.data]);
							}
						}
						videoObject.blob = videoBlob;
					}
				}
			}
		});
	};









	const list = ["OP1", "OP2", "OP3", "OP4", "OP1"];
	console.log(videoArrayRef.current.length)
	return (
		<div className="interface-container">
			<div style={{ flexDirection: "row", width: "10%" }}>
				<div className="Logo-container">
					Logo
				</div>
				<div
					className="left-list-container"
				>
					{list.map((item, index) => (
						<div
							key={index}
							style={{ cursor: "pointer", paddingBottom: 10 }}
							onClick={() => {
								console.log("CLICKED ON " + index);
								setSelectedIndex(index);
							}}
						>
							{item}
						</div>
					))}
				</div>
			</div>
			<div style={{ flexDirection: "row", width: "100%" }}>
				<div
					className="top-bar-container"
				>
					<div
						className="top-bar-container-first"
					>
						<DropdownList
							residents={residents}
							updateSelectedResident={updateSelectedResident}
						/>
					</div>
					<div className="top-bar-container-secound">
						B
					</div>
					<div className="top-bar-container-third">
						C
					</div>
					<div className="top-bar-container-fourth">D </div>
				</div>
				<div className="displayed-Video-container">
					{videoArrayRef.current.length > 0 ? <VideoSlide videos={selectedResidentVideos} selectedVideo={selectedVideos} handleSelectedVideos={handleSelectVideos} videoArrayRef={videoArrayRef.current} /> : null}
				</div>
			</div>
		</div>
	);
};

export default Interface;
