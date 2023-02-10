import { ListVideos } from "../components/utils/pageUtils/listVideos.jsx";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/layout/layout.jsx";
import { topLeftElements } from "../components/utils/pageUtils/NavbarElements/topLeftElements.jsx";
import { topRightElements } from "../components/utils/pageUtils/NavbarElements/topRightElements.jsx";
import { getObjectStorageIndex } from "../components/utils/db/storageObjectMethodes.jsx";
import { hasObjectStorageDatabase } from "../components/utils/db/storageObjectMethodes.jsx";
import { ListDir } from "../components/utils/ListDir.jsx";
import ModalLogin from "../components/utils/pageUtils/modal/login/ModalLogin.jsx";
import ModalSettings from "../components/utils/pageUtils/modal/settings/ModalSettings.jsx";

const OBJECT_STORE_USERDATA = "userData";
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = "customer";

const VideoPage = () => {
	const [userdata, setUserData] = useState();
	const [dbExist, setDbExist] = useState(false);
	const [newVideos, setNewVideos] = useState(0);
	const videosSeen = useRef([]);
	const errorRef = useRef();
	

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
		if (dbExist === false) {
			const hasVideos = async () => {
				let exist = await hasObjectStorageDatabase("db", "videos");
				setDbExist(exist);
			};
			hasVideos();
		}
	}, [dbExist]);

	useEffect(() => {
		if (userdata) {
			const downloadVideos = setInterval(() => {
				ListDir(userdata,errorRef, setNewVideos);
			}, 5000);
			return () => clearInterval(downloadVideos);
		}
	}, [userdata]);

	return (
		<div>
		
			<Layout
				navbar_left={topLeftElements}
				navbar_middle={userdata ? `Angemeldet : ${userdata.username}` : ""}
				navbar_right={<ModalSettings newVideos={newVideos} setNewVideos={setNewVideos}/>}
			>
				{dbExist && <ListVideos videosSeen={videosSeen} errorRef={errorRef}/>}
			</Layout>
			<ModalLogin userdata={userdata} />

		</div>
	);
};
export default VideoPage;
