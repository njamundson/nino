import { useState } from "react";
import EmailField from "../form-fields/EmailField";
import PasswordField from "../form-fields/PasswordField";
import NameFields from "../form-fields/NameFields";
import SubmitButton from "../form-fields/SubmitButton";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    onSubmit({ email, password, firstName, lastName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <NameFields
        firstName={firstName}
        lastName={lastName}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
      />

      <EmailField email={email} onChange={setEmail} />

      <PasswordField password={password} onChange={setPassword} />

      <PasswordField
        password={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="Confirm Password"
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <SubmitButton
        loading={loading}
        text="Sign Up"
        loadingText="Creating account..."
      />
    </form>
  );
};

export default SignUpForm;