type Props = {
  isInputFocused: boolean;
};

function Backdrop(props: Props) {
  return (
    <div
      className={`absolute top-0 left-0 w-full h-full z-50 pointer-events-none select-none flex items-center justify-center backdrop-blur-sm transition-opacity duration-150 ${
        props.isInputFocused ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="text-center font-mono">Click here to focus</p>
    </div>
  );
}

export default Backdrop;
