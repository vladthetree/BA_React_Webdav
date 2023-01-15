import "../../../../css/utilsStyle.css"

export const Popup = ({ open, onClose, children }) => {
    const handleClose = () => {
      onClose();
    };
    return (
      open && (
        <div className="popup-overlay" onClick={handleClose}>
        <div className="popup" onClick={e => e.stopPropagation()}>
          <button className="popup-close-button" onClick={handleClose}>X</button>
            {children}
          </div>
      </div>
)
);
};