type Props = {
  title: string;
  description: string;
};

const DashboardHeader = ({ title, description }: Props) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default DashboardHeader;
