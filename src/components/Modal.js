import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Modal = ({ showModal, setShowModal, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (!modalRef.current) return;

    if (showModal) {
      modalRef.current.showModal();
    } else {
      modalRef.current.close();
    }
  }, [showModal]);

  return (
    <dialog ref={modalRef} onClose={() => setShowModal(false)}>
      {children}
    </dialog>
  );
};

Modal.propTypes = {
  children: PropTypes.array,
  setShowModal: PropTypes.func,
  showModal: PropTypes.bool,
  setIsCategoryInput: PropTypes.func,
  socket: PropTypes.shape({
    id: PropTypes.string,
    on: PropTypes.func.isRequired,
    connect: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
  }).isRequired,
  messages: PropTypes.shape([
    {
      message: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    },
  ]),
  lastMessageRef: PropTypes.object,
};
export default Modal;
