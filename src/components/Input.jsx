const Input = ({ type = "text", textInputProps, selectProps }) => {
  if (type === "text") {
    return (
      <input
        type="text"
        {...textInputProps}
        className="rounded-md border border-black pl-2"
      />
    );
  } else if (type === "select") {
    const { selected, onChange, defaultValue, options } = selectProps;
    console.log({ defaultValue, selected });
    return (
      <select
        selected={selected}
        onChange={onChange}
        defaultValue={defaultValue}
        className="rounded-md border border-black pl-2"
      >
        {options.map((option) => {
          return <option value={option}>{option}</option>;
        })}
      </select>
    );
  }
};

export default Input;
