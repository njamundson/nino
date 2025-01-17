interface SignUpHeaderProps {
  title: string;
  subtitle: string;
}

const SignUpHeader = ({ title, subtitle }: SignUpHeaderProps) => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-medium text-nino-text">{title}</h1>
      <p className="text-nino-gray text-sm">{subtitle}</p>
    </div>
  );
};

export default SignUpHeader;