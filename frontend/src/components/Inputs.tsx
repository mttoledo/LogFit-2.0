export const Input = ({ placeholder, type = "text", ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="bg-white p-2 rounded-lg border-0 w-full text-xs placeholder:text-sm outline-none"
      {...props}
    />
  );
};
