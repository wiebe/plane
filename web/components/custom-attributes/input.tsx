import { forwardRef } from "react";

export const Input = forwardRef(
  (props: React.InputHTMLAttributes<HTMLInputElement>, ref: React.Ref<HTMLInputElement>) => {
    const { className = "", type, ...rest } = props;

    return (
      <input
        ref={ref}
        type={type ?? "text"}
        className={`placeholder:text-custom-text-400 text-xs px-3 py-2 rounded bg-custom-background-100 border border-custom-border-200 w-full focus:outline-none h-9 ${className}`}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";
