interface ApplicationFormHeaderProps {
  title: string;
  companyName: string;
}

const ApplicationFormHeader = ({ title, companyName }: ApplicationFormHeaderProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Apply to {title}</h2>
    </div>
  );
};

export default ApplicationFormHeader;