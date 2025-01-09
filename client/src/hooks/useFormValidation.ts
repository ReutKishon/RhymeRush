import { useState, useCallback, useEffect } from 'react';

type ValidationRule = {
  validate: (value: string) => boolean;
  message: string;
}

interface FieldConfig<T> {
  value: T;
  validations: ValidationRule[];
}

type FormConfig<T> = {
  [K in keyof T]: FieldConfig<T[K]>;
}

export function useFormValidation<T extends Record<string, string>>(formConfig: FormConfig<T>) {
  const [values, setValues] = useState<T>(() => {
    const initialValues = {} as T;
    for (const [key, config] of Object.entries(formConfig)) {
      initialValues[key as keyof T] = config.value;
    }
    return initialValues;
  });

  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isValid, setIsValid] = useState(false);

  // Validate a single field
  const validateField = useCallback((name: keyof T, value: string) => {
    const fieldConfig = formConfig[name];
    
    for (const rule of fieldConfig.validations) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return '';
  }, [formConfig]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let formIsValid = true;

    for (const [name, config] of Object.entries(formConfig)) {
      const error = validateField(name as keyof T, values[name as keyof T]);
      if (error) {
        newErrors[name as keyof T] = error;
        formIsValid = false;
      }
    }

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [values, formConfig, validateField]);

  // Handle input change
  const handleChange = useCallback((name: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  // Handle input blur
  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField, values]);

  // Validate form whenever values change
  useEffect(() => {
    validateForm();
  }, [values, validateForm]);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm
  };
} 