interface SignInHeaderProps {
  title: string;
  subtitle: string;
}

const SignInHeader = ({ title, subtitle }: SignInHeaderProps) => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-medium text-nino-text">{title}</h1>
      <p className="text-nino-gray text-sm">{subtitle}</p>
    </div>
  );
};

export default SignInHeader;