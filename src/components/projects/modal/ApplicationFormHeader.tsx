interface ApplicationFormHeaderProps {
  title: string;
  subtitle?: string;
  companyName?: string;
}

const ApplicationFormHeader = ({ title, subtitle, companyName }: ApplicationFormHeaderProps) => {
  return (
    <div className="border-b border-gray-100">
      <div className="px-8 py-6">
        {companyName && (
          <p className="text-sm font-medium text-gray-500 mb-2">
            {companyName}
          </p>
        )}
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-500 mt-2">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplicationFormHeader;