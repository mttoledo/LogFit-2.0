interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "calories";
}

export const Button = ({
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  // Base de estilos comuns a todos os botões
  const baseStyles =
    "px-5 py-[5px] text-xl text-white rounded-[10px] transition-all active:scale-95 cursor-pointer";

  // Variações de cor
  const variants = {
    primary: "bg-brand-mdblue hover:bg-brand-lgblue",
    calories: "bg-brand-green hover:bg-brand-gray",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
