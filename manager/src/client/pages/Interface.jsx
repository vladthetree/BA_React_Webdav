import React, { useRef, useEffect, useState } from "react";
import "../pages/css/Interface.css";
import CurrentVideo from "./layout/current_Video.jsx";
import Administration from "./layout/administration.jsx";
import VideoSlide from "./layout/videoSlide.jsx";
import { Buffer } from "buffer";
import { useWindowSize } from "react-use";
import DropdownList from "../../client/pages/layout/utils/components/dropdownList.jsx";

const username = "test";
const password = "12345";
const targetUrl = "https://localhost:8443/remote.php/dav/files/test/";

const Interface = () => {
	const [residents, setResidents] = useState(null);
	const [selectedResident, setSelectedResident] = useState(null);
	const [selectedResidentVideos, setSelectedResidentVideos] = useState(null);
	const [selectedVideos, setSelectedVideos] = useState([]);
	const { width, height } = useWindowSize([]);

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
		if (selectedResident && selectedResident !== "check pls") {
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

	const [selectedIndex, setSelectedIndex] = useState(null);

	const list = ["item1", "item2", "item3", "item4", "item5"];
	console.log(selectedResidentVideos);
	return (
		<div style={{ display: "flex", height: "100%", width: "100%" }}>
			<div style={{ flexDirection: "row", width: "10%" }}>
				<div style={{ backgroundColor: "yello", width: "100%", height: "10%" }}>
					Logo
				</div>
				<div
					style={{
						backgroundColor: "red",
						width: "100%",
						height: "90%",
						overflowY: "scroll",
					}}
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
					style={{
						display: "flex",
						flexDirection: "row",
						backgroundColor: "blue",
						width: "100%",
						height: "10%",
					}}
				>
					<div
						style={{
							backgroundColor: "blue",
							width: "25%",
							height: "100%",
							zIndex: "999",
						}}
					>
						<DropdownList
							residents={residents}
							updateSelectedResident={updateSelectedResident}
						/>
					</div>
					<div
						style={{ backgroundColor: "green", width: "25%", height: "100%" }}
					>
						B
					</div>
					<div
						style={{ backgroundColor: "yellow", width: "25%", height: "100%" }}
					>
						C
					</div>
					<div
						style={{ backgroundColor: "red", width: "25%", height: "100%" }}
					> </div>
				</div>
				<div style={{ backgroundColor: "green", width: "100%", height: "90%" }}>
					<VideoSlide videos={selectedResidentVideos} selectedVideo={selectedVideos} handleSelectedVideos={handleSelectVideos}/>
				</div>
			</div>
		</div>
	);
};

export default Interface;
