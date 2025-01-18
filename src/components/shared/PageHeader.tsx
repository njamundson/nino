interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="space-y-3 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
        {title}
      </h1>
      <p className="text-lg text-gray-500 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;