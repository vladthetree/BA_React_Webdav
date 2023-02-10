import React, { useState, useEffect } from "react";
import Settings from "./settings.jsx";

const ModalSettings = (props) => {
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };


  return (
    <div>
      <button onClick={handleOpenModal}>Open Settings</button>
      {showModal && (
        <div>
          <div>
            <Settings onClose={handleCloseModal} newVideos={props.newVideos} setNewVideos={props.setNewVideos}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalSettings;
