interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-medium text-nino-text tracking-tight">{title}</h1>
        <p className="text-nino-gray mt-1">{description}</p>
      </div>
    </div>
  );
};

export default PageHeader;