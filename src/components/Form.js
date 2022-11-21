import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";

const Form = function ({ onSubmit, onCancel, onDelete, contact }) {
  const {
    register,
    handleSubmit,
    formState,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
  } = useForm();

  useEffect(() => {
    if (contact) {
      setValue("firstName", contact.firstName);
      setValue("lastName", contact.lastName);
      setValue("phone", contact.phone);
      setValue("email", contact.email);
    }
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [contact, formState]);

  const handleCancelButton = (e) => {
    e.preventDefault();
    reset();
    onCancel();
  };

  const handleDeleteButton = () => {
    reset();
    onDelete();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col px-3 mb-2">
          <Input name="firstName" title="First Name" errors={errors} isRequired={true} register={register} />
        </div>
        <div className="flex flex-col px-3 mb-2">
          <Input name="lastName" title="Last Name" errors={errors} register={register} />
        </div>
        <div className="flex flex-col px-3 mb-2">
          <Input name="phone" title="Phone number" errors={errors} register={register} />
        </div>
        <div className="flex flex-col px-3 mb-2">
          <Input name="email" title="E-mail" errors={errors} register={register} />
        </div>
        <div className="mb-2 flex flex-row gap-x-2 justify-between px-3">
          <button type="submit" className="bg-hellion rounded text-soot py-2 flex-1">
            {contact ? "Update Contact" : "Add Contact"}
          </button>
          {contact && (
            <button onClick={handleCancelButton} className="bg-silver rounded text-soot flex-1">
              Cancel
            </button>
          )}
        </div>
      </form>
      {contact && (
        <div className="mt-5 mb-2 flex flex-col px-3">
          <button className="bg-wood text-soot py-2 flex-1" onClick={handleDeleteButton}>
            Delete Contact
          </button>
        </div>
      )}
    </>
  );
};

export default Form;
