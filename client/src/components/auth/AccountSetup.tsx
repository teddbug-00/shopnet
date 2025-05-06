import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../common/Card";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { ProgressSteps } from "../common/ProgressSteps";
import { Navbar } from "../common/Navbar";
import { slideUp } from "../../utils/animations";
import { updateAccountType } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { AccountSetupData, UserType } from "../../types/auth";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useSnackbar } from "../../context/SnackbarContext";

// Rest of the imports remain the same...

interface BusinessFormData {
  businessName: string;
  businessDescription: string;
  phone: string;
  address: string;
}

interface BuyerFormData {
  phone: string;
  address: string;
  preferences: string;
}

interface FormErrors {
  businessName?: string;
  phone?: string;
  address?: string;
}

const SELLER_STEPS = [
  "Account Type",
  "Business Details",
  "Verification",
] as const;
const BUYER_STEPS = [
  "Account Type",
  "Personal Details",
  "Preferences",
] as const;

export const AccountSetup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();

  // Show error snackbar if there's an error
  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error, showSnackbar]);

  const [currentStep, setCurrentStep] = useState(0);
  const [accountType, setAccountType] = useState<UserType | null>(null);
  const [businessFormData, setBusinessFormData] = useState<BusinessFormData>({
    businessName: "",
    businessDescription: "",
    phone: "",
    address: "",
  });
  const [buyerFormData, setBuyerFormData] = useState<BuyerFormData>({
    phone: "",
    address: "",
    preferences: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const steps = accountType === "seller" ? SELLER_STEPS : BUYER_STEPS;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;

    if (accountType === "seller") {
      setBusinessFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setBuyerFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (accountType === "seller") {
      if (!businessFormData.businessName) {
        newErrors.businessName = "Business name is required";
      }
      if (!businessFormData.phone) {
        newErrors.phone = "Phone number is required";
      }
      if (!businessFormData.address) {
        newErrors.address = "Address is required";
      }
    } else {
      if (!buyerFormData.phone) {
        newErrors.phone = "Phone number is required";
      }
      if (!buyerFormData.address) {
        newErrors.address = "Address is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (): void => {
    if (currentStep === 1 && !validateForm()) {
      // Show validation errors in snackbar
      const errorMessages = Object.values(errors).filter(Boolean);
      if (errorMessages.length > 0) {
        showSnackbar(errorMessages[0], "error");
      }
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = (): void => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = async (): Promise<void> => {
    if (!validateForm() || !accountType) {
      // Show validation errors in snackbar
      const errorMessages = Object.values(errors).filter(Boolean);
      if (errorMessages.length > 0) {
        showSnackbar(errorMessages[0], "error");
      }
      return;
    }

    try {
      const setupData: AccountSetupData = {
        accountType,
        profile:
          accountType === "seller"
            ? {
                businessName: businessFormData.businessName,
                businessDescription: businessFormData.businessDescription,
                phone: businessFormData.phone,
                address: businessFormData.address,
              }
            : {
                phone: buyerFormData.phone,
                address: buyerFormData.address,
                ...(buyerFormData.preferences && {
                  preferences: buyerFormData.preferences,
                }),
              },
      };

      const result = await dispatch(updateAccountType(setupData));

      if (updateAccountType.fulfilled.match(result)) {
        showSnackbar("Account setup completed successfully!", "success");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Setup failed:", err);
      showSnackbar("Account setup failed. Please try again.", "error");
    }
  };


  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <motion.div {...slideUp} className="w-full max-w-md py-4">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Let's set up your account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentStep === 0
                  ? "First, tell us how you'll be using ShopNet"
                  : currentStep === 1
                    ? accountType === "seller"
                      ? "Tell us about your business"
                      : "Tell us about yourself"
                    : accountType === "seller"
                      ? "Final verification step"
                      : "Verify your phone number"}
              </p>
            </div>

            <ProgressSteps steps={steps} currentStep={currentStep} />

            <div className="mt-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 0 && renderAccountTypeSelection()}
                  {currentStep === 1 &&
                    (accountType === "seller"
                      ? renderBusinessDetails()
                      : renderBuyerDetails())}
                  {currentStep === 2 &&
                    (accountType === "seller"
                      ? renderVerification()
                      : renderPhoneVerification())}
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );

  function renderAccountTypeSelection() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAccountType("buyer")}
            className={`
              p-6 rounded-xl border-2 text-center transition-colors
              ${
                accountType === "buyer"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 dark:border-gray-800 hover:border-primary/50"
              }
            `}
          >
            <h3 className="text-lg font-semibold mb-2">Buyer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              I want to purchase products
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAccountType("seller")}
            className={`
              p-6 rounded-xl border-2 text-center transition-colors
              ${
                accountType === "seller"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 dark:border-gray-800 hover:border-primary/50"
              }
            `}
          >
            <h3 className="text-lg font-semibold mb-2">Seller</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              I want to sell products
            </p>
          </motion.button>
        </div>

        <Button fullWidth onClick={handleNext} disabled={!accountType}>
          Continue
        </Button>
      </div>
    );
  }

  function renderBuyerDetails() {
    return (
      <div className="space-y-6">
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={buyerFormData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          leftIcon={<PhoneIcon className="w-5 h-5" />}
          required
        />

        <Input
          label="Delivery Address"
          name="address"
          value={buyerFormData.address}
          onChange={handleInputChange}
          error={errors.address}
          leftIcon={<MapPinIcon className="w-5 h-5" />}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Shopping Preferences (Optional)
          </label>
          <textarea
            name="preferences"
            value={buyerFormData.preferences}
            onChange={handleInputChange}
            rows={4}
            className="input-field"
            placeholder="Tell us what kind of products you're interested in"
          />
        </div>

        <div className="flex space-x-4">
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
          <Button fullWidth onClick={handleNext}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  function renderBusinessDetails() {
    return (
      <div className="space-y-6">
        <Input
          label="Business Name"
          name="businessName"
          value={businessFormData.businessName}
          onChange={handleInputChange}
          error={errors.businessName}
          leftIcon={<BuildingOfficeIcon className="w-5 h-5" />}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Business Description
          </label>
          <textarea
            name="businessDescription"
            value={businessFormData.businessDescription}
            onChange={handleInputChange}
            rows={4}
            className="input-field pl-10"
            placeholder="Tell us about your business"
          />
        </div>

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={businessFormData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          leftIcon={<PhoneIcon className="w-5 h-5" />}
          required
        />

        <Input
          label="Business Address"
          name="address"
          value={businessFormData.address}
          onChange={handleInputChange}
          error={errors.address}
          leftIcon={<MapPinIcon className="w-5 h-5" />}
          required
        />

        <div className="flex space-x-4">
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
          <Button fullWidth onClick={handleNext}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  function renderVerification() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Almost there!</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We'll need to verify your business details before you can start
            selling.
          </p>
        </div>

        <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please have these documents ready:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>Business registration document</li>
            <li>Tax identification number</li>
            <li>Government-issued ID</li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
          <Button fullWidth onClick={handleComplete}>
            Submit for Review
          </Button>
        </div>
      </div>
    );
  }

  function renderPhoneVerification() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Verify your phone number</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We've sent a verification code to your phone
          </p>
        </div>

        <Input
          label="Verification Code"
          name="verificationCode"
          type="text"
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="text-center text-2xl tracking-wider"
        />

        <div className="text-center">
          <button className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors">
            Didn't receive the code? Resend
          </button>
        </div>

        <div className="flex space-x-4">
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
          <Button fullWidth onClick={handleComplete}>
            Complete Setup
          </Button>
        </div>
      </div>
    );
  }
  
};
