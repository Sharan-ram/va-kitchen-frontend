import classNames from "classnames";

const Input = ({ type = "text", textInputProps, selectProps, classes }) => {
  if (type === "text") {
    return (
      <input
        type="text"
        {...textInputProps}
        className={classNames(
          "rounded-md border border-black pl-2 w-full",
          classes.wrapper
        )}
      />
    );
  } else if (type === "select") {
    const { selected, onChange, defaultValue, options, name } = selectProps;
    return (
      <select
        selected={selected}
        onChange={onChange}
        defaultValue={defaultValue}
        name={name}
        // className="rounded-md border border-black pl-2 w-full cursor-pointer"
        className={classNames(
          "rounded-md border border-gray-300 p-2 w-full",
          classes?.wrapper
        )}
      >
        {options.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>
    );
  }
};

export default Input;
