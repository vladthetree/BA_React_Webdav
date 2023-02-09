import React, { useState, useEffect } from "react";
import Settings from "./settings.jsx";

const ModalSettings = (props) => {
  const [showModal, setShowModal] = useState(false);
  const { userdata = {} } = props;
  const userDataArray = [];

  Object.entries(userdata).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      userDataArray.push({ name: key, value, status: true });
    }
  });

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
            <Settings onClose={handleCloseModal} userdataArray={userDataArray} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalSettings;
