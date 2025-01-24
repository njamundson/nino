interface ApplicationMessageProps {
  coverLetter: string;
}

const ApplicationMessage = ({ coverLetter }: ApplicationMessageProps) => {
  return (
    <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100">
      <h3 className="font-medium text-gray-900 mb-3">Application Message</h3>
      <p className="text-gray-600 leading-relaxed break-words whitespace-pre-wrap">
        {coverLetter}
      </p>
    </div>
  );
};

export default ApplicationMessage;