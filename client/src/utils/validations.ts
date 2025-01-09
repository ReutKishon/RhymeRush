export const validations = {
  required: {
    validate: (value: string) => value.trim() !== '',
    message: 'This field is required'
  },
  email: {
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  minLength: (min: number) => ({
    validate: (value: string) => value.length >= min,
    message: `Must be at least ${min} characters`
  }),
  maxLength: (max: number) => ({
    validate: (value: string) => value.length <= max,
    message: `Must be no more than ${max} characters`
  }),
  matchesPassword: (password: string) => ({
    validate: (value: string) => value === password,
    message: 'Passwords do not match'
  })
}; 