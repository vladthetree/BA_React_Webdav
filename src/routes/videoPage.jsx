import { ListVideos } from "../components/utils/pageUtils/listVideos";
import { useState, useEffect } from "react";
import Layout from "../components/layout/layout";
import { topLeftElements } from "../components/utils/pageUtils/NavbarElements/topLeftElements";
import { getObjectStorageIndex } from "../components/utils/db/storageObjectMethodes";

const someName = "Angemeldet : SomeName";
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
