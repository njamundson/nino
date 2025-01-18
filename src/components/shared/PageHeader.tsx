interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-medium tracking-tight text-gray-900">
        {title}
      </h1>
      <p className="text-xl text-gray-500">{description}</p>
    </div>
  );
};

export default PageHeader;