interface ApplicationFormHeaderProps {
  title: string;
  companyName: string;
}

const ApplicationFormHeader = ({ title, companyName }: ApplicationFormHeaderProps) => {
  return (
    <div className="border-b border-gray-100">
      <div className="px-8 py-6">
        <p className="text-sm font-medium text-gray-500 mb-2">
          {companyName}
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Apply to {title}
        </h2>
      </div>
    </div>
  );
};

export default ApplicationFormHeader;