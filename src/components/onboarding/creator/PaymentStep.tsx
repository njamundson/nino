interface PaymentStepProps {
  onSubmit: () => void;
}

const PaymentStep = ({ onSubmit }: PaymentStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-nino-text">Payment Information</h2>
        <p className="text-nino-gray mt-2">
          Set up your payment details to receive payments from brands
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-nino-text mb-2">Payment Method</h3>
          <p className="text-sm text-nino-gray">
            Connect your preferred payment method to receive payments directly to your account.
          </p>
          <button
            className="mt-4 w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-nino-text hover:bg-gray-50 transition-colors"
            onClick={onSubmit}
          >
            Connect Payment Method
          </button>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-nino-text mb-2">Payout Schedule</h3>
          <p className="text-sm text-nino-gray">
            Choose how often you'd like to receive your payments.
          </p>
          <select className="mt-4 w-full p-2 border border-gray-200 rounded-lg bg-white">
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-nino-text mb-2">Tax Information</h3>
          <p className="text-sm text-nino-gray">
            We'll need your tax information to process your payments correctly.
          </p>
          <button
            className="mt-4 w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-nino-text hover:bg-gray-50 transition-colors"
            onClick={onSubmit}
          >
            Add Tax Information
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-nino-primary text-white rounded-lg hover:bg-nino-primary/90 transition-colors"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;