import { ListVideos } from "../components/utils/pageUtils/listVideos.jsx";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/layout/layout.jsx";
import { topLeftElements } from "../components/utils/pageUtils/NavbarElements/topLeftElements.jsx";
import { hasObjectStorageDatabase } from "../components/utils/db/storageObjectMethodes.jsx";
import { ListDir } from "../components/utils/ListDir.jsx";
import ModalSettings from "../components/utils/pageUtils/modal/settings/ModalSettings.jsx";
import { getObjectStorageIndex } from "../components/utils/db/storageObjectMethodes.jsx";

const OBJECT_STORE_USERDATA = "userData";
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = "customer";

const VideoPage = () => {
	const [dbExist, setDbExist] = useState(false);
	const [newVideos, setNewVideos] = useState(0);
	const [userdata, setUserData] = useState();
	//const [isOnline, setIsOnline] = useState(window.navigator.onLine);
	const [isOnline, setIsOnline] = useState(false);

	const videosSeen = useRef([]);
	const errorRef = useRef();

	const handleNewVideos = (isDefaultOn) => {
		// console.log("INSIDE HANDLE NEW VIDEOS");
		// console.log(newVideos);
		if (isDefaultOn) {
			// console.log("IS DEFAULT ON TRIGGER");
			return newVideos;
		} else {
			// console.log("IS DEFAULT OFF TRIGGER");
			setNewVideos(0);
			return newVideos;
		}
	};

	useEffect(() => {
		const getData = async () => {
			const resivedUserData = await getObjectStorageIndex(
				OBJECT_STORE_USERDATA,
				OBJECT_STORE_USERDATA_OBJECTSTORAGE,
				"adress01",
			);
			if (resivedUserData) {
				const result = resivedUserData.fileContext;
				setUserData(result);
			}
		};

		if (!userdata) {
			const interval = setInterval(() => {
				getData();
			}, 500);
			return () => clearInterval(interval);
		}
	}, [userdata]);

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);
		};

		const handleOffline = () => {
			setIsOnline(false);
		};
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	// opt here
	useEffect(() => {
		if (dbExist === false) {
			const hasVideos = async () => {
				let exist = await hasObjectStorageDatabase("db", "videos");
				setDbExist(exist);
			};
			hasVideos();
		}
	}, [dbExist]);

	useEffect(() => {
		if (userdata && isOnline) {
			console.log("#-- User is online --#");
			const downloadVideos = setInterval(() => {
				ListDir(userdata, errorRef, setNewVideos);
			}, 5000);
			return () => clearInterval(downloadVideos);
		} else {
		}
	}, [userdata, isOnline]);

	const displayName = () => {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						height: "10px",
						width: "10px",
						backgroundColor: isOnline ? "green" : "red",
						borderRadius: "50%",
						display: "inline-block",
						marginRight: "5px",
					}}
				/>
				<div>Angemeldet : {userdata.username}</div>
			</div>
		);
	};

	return (
		<div>
			<Layout
				userdata={userdata}
				handleNewVideos={handleNewVideos}
				navbar_left={topLeftElements}
				navbar_middle={userdata ? displayName() : ""}
				navbar_right={
					<ModalSettings newVideos={newVideos} setNewVideos={setNewVideos} />
				}
			>
				{dbExist && <ListVideos videosSeen={videosSeen} errorRef={errorRef} />}
			</Layout>
		</div>
	);
};
export default VideoPage;
