import "./AppModal.scss";
import { Button } from "@shopify/polaris";
import { IoCloseOutline } from "react-icons/io5";

const AppModal = ({ open = false, onClose, children, onOk, onCancel }) => {
  return open ? (
    <div
      className="app__modal-container"
      // onClick={(e) => {
      //   e.stopPropagation();
      //   onClose && onClose();
      // }}
    >
      <div className="app__modal-inner">
        <div
          className="app__modal-close"
          onClick={() => {
            onClose && onClose();
          }}
        >
          <IoCloseOutline />
        </div>
        <div className="app__modal-content">{children}</div>
        <div className="app__modal-footer">
          <Button
            onClick={() => {
              onCancel && onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onOk && onOk();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AppModal;
