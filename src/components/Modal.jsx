import usePreventScroll from "@/hooks/usePreventScroll";

const Modal = ({ children }) => {
  usePreventScroll();
  return (
    <div className="fixed z-[9999] top-0 left-0 w-screen h-screen backdrop-blur-[4px]">
      <div className="fixed xl:top-[13px] lg:top-[13px] bottom-0 xl:right-[13px] lg:right-[13px] right-0 z-[99999] bg-[#E8E3E4] box-border xl:w-[380px] lg:w-[380px] w-full xl:h-[99%] lg:h-[99%] h-[90%] border-2 border-[#8e7576] shadow-md rounded-lg p-4">
        {children}
      </div>
    </div>
  );
};

export default Modal;
