interface BrandOnboardingContainerProps {
  children: React.ReactNode;
}

const BrandOnboardingContainer = ({ children }: BrandOnboardingContainerProps) => {
  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)] p-8 space-y-8">
        {children}
      </div>
    </div>
  );
};

export default BrandOnboardingContainer;