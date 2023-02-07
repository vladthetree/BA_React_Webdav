import { ListVideos } from "../components/utils/pageUtils/listVideos.jsx";
import React, { useState, useEffect } from "react";
import Layout from "../components/layout/layout.jsx";
import { topLeftElements } from "../components/utils/pageUtils/NavbarElements/topLeftElements.jsx";
import { topRightElements } from "../components/utils/pageUtils/NavbarElements/topRightElements.jsx";
import { getObjectStorageIndex } from "../components/utils/db/storageObjectMethodes.jsx";
import { hasObjectStorageDatabase } from "../components/utils/db/storageObjectMethodes.jsx";
import { ListDir } from "../components/utils/ListDir.jsx";
import Modal from "../components/utils/modalLogin.jsx";

const OBJECT_STORE_USERDATA = "userData";
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = "customer";

const VideoPage = () => {
	const [userdata, setUserData] = useState();
	const [dbExist, setDbExist] = useState(false);

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
				ListDir(userdata);
			}, 5000);
			return () => clearInterval(downloadVideos);
		}
	}, [userdata]);

	return (
		<div>
			<Layout
				navbar_left={topLeftElements}
				navbar_middle={userdata ? `Angemeldet : ${userdata.username}` : ""}
				navbar_right={topRightElements}
			>
				{dbExist && <ListVideos />}
			</Layout>
			<Modal userdata={userdata} />
		</div>
	);
};
export default VideoPage;
