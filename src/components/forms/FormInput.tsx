const FormInput = ({
  label,
  type = "text",
}: {
  label: string;
  type?: string;
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default FormInput;
