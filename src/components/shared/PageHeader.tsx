interface PageHeaderProps {
  title: string;
  description: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="mb-8 animate-fadeIn">
      <h1 className="text-3xl font-medium tracking-tight text-nino-text">
        {title}
      </h1>
      <p className="mt-2 text-lg text-nino-gray">{description}</p>
    </div>
  );
};

export default PageHeader;