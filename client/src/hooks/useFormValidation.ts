import { useState, useCallback, useEffect, useRef } from 'react';

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
  
  // Use ref to prevent infinite loop
  const prevValuesRef = useRef(values);

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

    for (const [name] of Object.entries(formConfig)) {
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

  const handleChange = useCallback((name: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField, values]);

  // Run validation only when values actually change
  useEffect(() => {
    if (JSON.stringify(prevValuesRef.current) === JSON.stringify(values)) {
      return;
    }
    
    prevValuesRef.current = values;
    const newErrors: Partial<Record<keyof T, string>> = {};
    let formIsValid = true;

    for (const [name] of Object.entries(formConfig)) {
      const error = validateField(name as keyof T, values[name as keyof T]);
      if (error) {
        newErrors[name as keyof T] = error;
        formIsValid = false;
      }
    }

    setErrors(newErrors);
    setIsValid(formIsValid);
  }, [values, formConfig, validateField]);

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