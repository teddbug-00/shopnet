interface ProgressStepsProps {
  steps: readonly string[];
  currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center w-full mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex flex-col items-center relative flex-1">
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                transition-colors duration-200 z-10
                ${index <= currentStep 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}
              `}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400 absolute -bottom-6 w-full text-center">
              {step}
            </span>
            {index < steps.length - 1 && (
              <div 
                className={`
                  absolute top-4 left-1/2 w-full h-0.5
                  transition-colors duration-200
                  ${index < currentStep 
                    ? 'bg-primary' 
                    : 'bg-gray-200 dark:bg-gray-800'}
                `}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};