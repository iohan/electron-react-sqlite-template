import React from "react";

const FormError = function ({ errorMessage }) {
  return <p className="text-wood mt-1">{errorMessage}</p>;
};

const Input = ({ register, errors, isRequired = false, title, name }) => {
  return (
    <>
      <label className="pb-1 text-clear">{title}</label>
      <input
        type="text"
        name={name}
        {...register(name, { required: isRequired })}
        className="bg-clear rounded border-2 text-soot border-clear focus:outline-none focus:border-2 focus:border-soot shadow appearance-none px-2 py-1"
      />
      {errors[name] && <FormError errorMessage={`${title} is required`} />}
    </>
  );
};

export default Input;
