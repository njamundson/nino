interface BrandOnboardingContainerProps {
  children: React.ReactNode;
}

const BrandOnboardingContainer = ({ children }: BrandOnboardingContainerProps) => {
  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-8">
        {children}
      </div>
    </div>
  );
};

export default BrandOnboardingContainer;