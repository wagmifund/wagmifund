import clsx from "clsx";

interface ModalProps {
  show: boolean;
  children: JSX.Element | JSX.Element[];
  title: string;
  onClose: () => void;
}
const Modal = (props: ModalProps) => {
  const { show, children, title, onClose } = props;
  return (
    <div key={title} className={clsx("modal", show ? "modal-open" : null)}>
      <div className="modal-box relative">
        <label
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </label>
        {children}
      </div>
    </div>
  );
};

export default Modal;
