interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <div className="mb-8 animate-fadeIn flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-nino-text">
          {title}
        </h1>
        <p className="mt-2 text-lg text-nino-gray">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default PageHeader;