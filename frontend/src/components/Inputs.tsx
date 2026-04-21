interface InputProps {
  placeholder: any;
  type?: string;
  [x: string]: any;
}

export const Input = ({ placeholder, type = "text", ...props }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="bg-white p-2 rounded-lg border-0 text-xs placeholder:text-sm outline-none"
      {...props}
    />
  );
};
