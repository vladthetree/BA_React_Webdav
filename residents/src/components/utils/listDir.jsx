import {
	addToIndexDbStore,
	removeAlreadyStoredFiles,
} from "./db/storageObjectMethodes.jsx";
import { Buffer } from "buffer";
import React,{useRef} from "react";

const DATABASE_VIDEOS = "db";
const OBJECT_STORE_VIDEOS = "videos";

export const ListDir = async (userdata) => {

	const content = await listContent({ userdata });
	const mp4Files = await filterMp4Files(content);
	await removeAlreadyStoredFiles(
		DATABASE_VIDEOS,
		mp4Files,
		OBJECT_STORE_VIDEOS,
	);
	if (mp4Files.length > 0) {
		console.log("#--New Files available--#");
		await getFileContent(userdata, mp4Files);
	} else {
		console.log("#--No new Files to Upload--#");
	}

};

async function filterMp4Files(content) {
	return content.filter((item) => item.basename.includes(".mp4"));
}

const listContent = async ({ userdata }) => {
	try {
		const response = await fetch("/proxy/listContent", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: userdata.nextCloudUserName,
				password: userdata.nextCloudPassword,
				targetUrl: userdata.webdavAdress,
			}),
		});
		const content = await response.json();
		return content;
	} catch (error) {
		console.error(error);
	}
};

const getFileContent = async (userdata, newMp4FilesArray) => {
	try {
		const response = await fetch("/proxy/getFileContent", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: userdata.nextCloudUserName,
				password: userdata.nextCloudPassword,
				targetUrl: userdata.webdavAdress,
				newFiles: newMp4FilesArray,
			}),
		});
		const content = await response.json();
		console.log("\n\n\n#-- new Videos resieved --#");
		console.log("#-- start download into IndexDB --#\n\n\n");
		console.log(content);
		content.forEach((newFile) => {
			let buffer = Buffer.from(newFile.buffer);

			addToIndexDbStore(
				DATABASE_VIDEOS,
				OBJECT_STORE_VIDEOS,
				"readwrite",
				newFile.name,
				buffer,
			);
		});
		return content;
	} catch (error) {
		console.error(error);
	}
};
