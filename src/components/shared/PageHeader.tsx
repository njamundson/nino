interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-nino-text">{title}</h1>
        <p className="text-nino-gray">{description}</p>
      </div>
    </div>
  );
};

export default PageHeader;