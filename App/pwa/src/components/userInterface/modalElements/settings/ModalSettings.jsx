import React, { useState } from 'react';
import Settings from './settings.jsx';

const ModalSettings = () => {
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
            <Settings onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalSettings;
