import Modal from "react-modal";
import { IoIosClose } from "react-icons/io";
import styles from "./Modal.module.css";

type CustomModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  closeButton?: boolean;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#191F2D",
    zIndex: "10",
  },
};

export function CustomModal({
  isOpen,
  onClose,
  children,
  closeButton,
}: CustomModalProps) {
  return (
    <Modal
      style={customStyles}
      isOpen={isOpen}
      overlayClassName={styles.overlay}
    >
      {closeButton && onClose && (
        <button className="absolute top-1 right-1 text-white" onClick={onClose}>
          <IoIosClose size="2rem" className="text-white" />
        </button>
      )}
      {children}
    </Modal>
  );
}
