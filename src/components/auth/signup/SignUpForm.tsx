import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import NameFields from "./form/NameFields";
import EmailField from "./form/EmailField";
import PasswordFields from "./form/PasswordFields";
import SubmitButton from "./form/SubmitButton";

interface SignUpFormProps {
  onSubmit: (formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => void;
  loading: boolean;
}

const SignUpForm = ({ onSubmit, loading }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return false;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter both first and last name");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({ email, password, firstName, lastName });
  };

  const handleNameChange = (field: 'firstName' | 'lastName', value: string) => {
    if (field === 'firstName') {
      setFirstName(value);
    } else {
      setLastName(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <NameFields
        firstName={firstName}
        lastName={lastName}
        onChange={handleNameChange}
        disabled={loading}
      />

      <EmailField
        email={email}
        onChange={setEmail}
        disabled={loading}
      />

      <PasswordFields
        password={password}
        confirmPassword={confirmPassword}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        disabled={loading}
      />

      <SubmitButton loading={loading} />
    </form>
  );
};

export default SignUpForm;