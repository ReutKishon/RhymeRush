import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

type ValidationRule = {
  validate: (value: string) => boolean;
  message: string;
}

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  validations?: ValidationRule[];
  onValidationChange?: (isValid: boolean) => void;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, validations = [], onValidationChange, className, onChange, ...props }, ref) => {
    const [error, setError] = useState<string>('');
    const [shake, setShake] = useState(false);
    const [touched, setTouched] = useState(false);

    const validate = (value: string) => {
      if (!touched) return;

      for (const rule of validations) {
        if (!rule.validate(value)) {
          setError(rule.message);
          onValidationChange?.(false);
          return false;
        }
      }
      
      setError('');
      onValidationChange?.(true);
      return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      validate(e.target.value);
    };

    const handleBlur = () => {
      setTouched(true);
      validate(props.value?.toString() || '');
    };

    useEffect(() => {
      if (error) {
        setShake(true);
        const timer = setTimeout(() => setShake(false), 500);
        return () => clearTimeout(timer);
      }
    }, [error]);

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          onChange={handleChange}
          onBlur={handleBlur}
          className={twMerge(`
            w-full 
            border-2 
            rounded-xl 
            py-3 
            pl-4 
            transition-all 
            duration-200
            bg-primary-yellow
            ${error ? 'border-red-500' : 'border-transparent'}
            ${shake ? 'animate-shake' : ''}
            focus:ring-4 
            focus:outline-none 
            uppercase
          `, className)}
        />
        {error && (
          <p className="mt-1 text-red-500 text-sm uppercase">{error}</p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

export default CustomInput; 