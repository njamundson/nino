import { useState } from "react";

interface AuthFormState {
  email: string;
  password: string;
}

export const useAuthForm = (initialState: AuthFormState = { email: "", password: "" }) => {
  const [formData, setFormData] = useState<AuthFormState>(initialState);
  const [errors, setErrors] = useState<Partial<AuthFormState>>({});

  const validateForm = () => {
    const newErrors: Partial<AuthFormState> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof AuthFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    formData,
    errors,
    validateForm,
    handleChange,
  };
};