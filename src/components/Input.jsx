const Input = ({ type = "text", textInputProps, selectProps }) => {
  if (type === "text") {
    return (
      <input
        type="text"
        {...textInputProps}
        className="rounded-md border border-black pl-2 w-full"
      />
    );
  } else if (type === "select") {
    const { selected, onChange, defaultValue, options } = selectProps;
    return (
      <select
        selected={selected}
        onChange={onChange}
        defaultValue={defaultValue}
        className="rounded-md border border-black pl-2 w-full"
      >
        {options.map((option) => {
          return <option value={option}>{option}</option>;
        })}
      </select>
    );
  }
};

export default Input;
