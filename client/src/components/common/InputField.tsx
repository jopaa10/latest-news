import { InputFieldProps } from "../../types";

const InputField = ({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  required = true,
}: InputFieldProps) => {
  return (
    <div className="input-container">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required}
      />
    </div>
  );
};

export default InputField;
