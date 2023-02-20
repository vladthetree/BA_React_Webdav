import { useEffect, useState } from "react";
import { NewFileControll } from "../utils/NewFileControll.jsx";
import { getObjectStorageIndex } from "../db/storageObjectMethodes.jsx";

const OBJECT_STORE_USERDATA = "userData";
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = "customer";

const SyncListdir = () => {
	const [userdata, setUserData] = useState();
	const [isOnline, setIsOnline] = useState(window.navigator.onLine);

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
		if (userdata && isOnline) {
			const downloadVideos = setInterval(() => {
				NewFileControll(userdata);
			}, 5000);
			return () => clearInterval(downloadVideos);
		}
	}, [userdata, isOnline]);
};

export default SyncListdir;
