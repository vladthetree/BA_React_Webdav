import { ListVideos } from "../components/utils/pageUtils/listVideos.jsx";
import { useState, useEffect } from "react";
import React from 'react';
import Layout from "../components/layout/layout.jsx";
import { topLeftElements } from "../components/utils/pageUtils/NavbarElements/topLeftElements.jsx";
import { getObjectStorageIndex } from "../components/utils/db/storageObjectMethodes.jsx";

const OBJECT_STORE_USERDATA = "userData";
const OBJECT_STORE_USERDATA_OBJECTSTORAGE = "customer";

const VideoPage = () => {
  const [username, setUserName] = useState("No User Registered.");

  useEffect(
    () => {
      const getName = async () => {
        let result = await getObjectStorageIndex(
          OBJECT_STORE_USERDATA,
          OBJECT_STORE_USERDATA_OBJECTSTORAGE,
          "customer01"
        );
        setUserName(result.fileContext.username);
      };
      getName();
    },
    [username]
  );

  return (
    <Layout navbar_left={topLeftElements} navbar_middle={username}>
      <ListVideos />
    </Layout>
  );
};
export default VideoPage;
