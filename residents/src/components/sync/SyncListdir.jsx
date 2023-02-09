import React, { useEffect, useState } from "react";
import { ListDir } from "../utils/ListDir.jsx";
import { getObjectStorageIndex } from "../utils/db/storageObjectMethodes.jsx";

const OBJECT_STORE_USERDATA = "userData";
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = "customer";

const SyncListdir = () => {
	const [userdata, setUserData] = useState();
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
		if (userdata) {
			const downloadVideos = setInterval(() => {
				ListDir(userdata);
			}, 5000);
			return () => clearInterval(downloadVideos);
		}
	}, [userdata]);
    
};

export default SyncListdir;

