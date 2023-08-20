import usePreventScroll from "@/hooks/usePreventScroll";

const Modal = ({ children }) => {
  usePreventScroll();
  return (
    <div
      className="fixed top-0 left-0 bottom-0 right-0 z-[99999] bg-black-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 99999,
      }}
    >
      <div
        className="fixed bottom-0 left-0 bg-black-modal w-full "
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "silver",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
