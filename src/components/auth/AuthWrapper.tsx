import { useAuthState } from "@/hooks/useAuthState";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isInitialized } = useAuthState();

  // Show nothing until we've checked the session
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;