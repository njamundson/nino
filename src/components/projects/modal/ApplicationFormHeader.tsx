interface ApplicationFormHeaderProps {
  title: string;
  companyName: string;
}

const ApplicationFormHeader = ({ title, companyName }: ApplicationFormHeaderProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Apply to {title}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Tell {companyName} why you'd be a great fit for this opportunity.
      </p>
    </div>
  );
};

export default ApplicationFormHeader;