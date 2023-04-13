import { removeAlreadyStoredFiles } from '../model/db/storageObjectMethods.js';
import webSocketConection from './../services/websocketConnection.js';
import listContent from './../services/listContent.js';

const DATABASE_VIDEOS = `${process.env.DATABASE_VIDEOS}`;
const OBJECT_STORE_VIDEOS = `${process.env.OBJECT_STORE_VIDEOS}`;

export default async function newFileControll(userdata, actions) {
  let mp4FilesNames = null;

  console.log('#-- No ongoing requests --#');
  mp4FilesNames = await listContent(userdata).then((contentArray) => {
    actions.setIsRequesting(true);
    return contentArray;
  });
  if (mp4FilesNames) {
    await removeAlreadyStoredFiles(
      DATABASE_VIDEOS,
      mp4FilesNames,
      OBJECT_STORE_VIDEOS,
    );
    if (mp4FilesNames.length > 0) {
      console.log('#--New Files available--#');
      console.log('#-- New Files : --#');
      await webSocketConection(userdata, mp4FilesNames, actions).then(() => {
        actions.setNewVideos(mp4FilesNames);
      });
    } else {
      console.log('#--No new Files to Upload--#');
      actions.setIsRequesting(false);
    }
  } else {
    actions.setIsRequesting(false);
  }
}
