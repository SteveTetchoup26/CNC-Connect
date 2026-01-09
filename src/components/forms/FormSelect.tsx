const FormSelect = ({
  label,
  options,
}: {
  label: string;
  options: string[];
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select className="rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">Sélectionner</option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
