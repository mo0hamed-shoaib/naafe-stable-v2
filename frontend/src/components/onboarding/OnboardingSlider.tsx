import React, { useState } from 'react';
import PostJobInstructions from './steps/PostJobInstructions';
import RespondToJobInstructions from './steps/RespondToJobInstructions';
import TrustTips from './steps/TrustTips';
import PaymentTips from './steps/PaymentTips';

interface OnboardingSliderProps {
  onComplete: () => void;
}

const OnboardingSlider: React.FC<OnboardingSliderProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

  const steps = [
    {
      title: 'نشر طلب خدمة',
      component: PostJobInstructions,
    },
    {
      title: 'الرد على الطلبات',
      component: RespondToJobInstructions,
    },
    {
      title: 'نصائح الأمان والثقة',
      component: TrustTips,
    },
    {
      title: 'نصائح الدفع',
      component: PaymentTips,
    },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Don't allow skipping on the last step
    if (currentStep < totalSteps - 1) {
      onComplete();
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 font-cairo" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-deep-teal mb-2">مرحباً بك في نافع</h2>
        <p className="text-text-secondary">تعرف على كيفية استخدام المنصة بفعالية</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-deep-teal">الخطوة {currentStep + 1} من {totalSteps}</span>
          <span className="text-sm text-text-secondary">{steps[currentStep].title}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-deep-teal h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[200px] flex items-center justify-center">
        <CurrentStepComponent />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-3 text-deep-teal font-semibold rounded-xl border border-deep-teal hover:bg-deep-teal hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          السابق
        </button>

        <div className="flex gap-3">
          {currentStep < totalSteps - 1 && (
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-text-secondary font-semibold rounded-xl border border-gray-300 hover:bg-gray-100 transition-all duration-300">
              تخطي
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-deep-teal text-white font-semibold rounded-xl hover:bg-deep-teal/90 transition-all duration-300 shadow-lg">
            {currentStep === totalSteps - 1 ? 'إنهاء' : 'التالي'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSlider; 