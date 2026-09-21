"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import api from "@/lib/api";
import { getPaymentErrorMessage } from "@/app/(main)/about/donations/donate/utils/paymentErrors";

interface RazorpayCheckoutProps {
  amount: number; // Amount in INR
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onInitiate?: () => void;
  onSuccess: (response: Record<string, unknown>) => void;
  onFailure?: (error: unknown) => void;
  buttonText?: string;
  className?: string; // Additional classes for the button
  disabled?: boolean;
  renderButton?: (onClick: () => void, isLoading: boolean) => React.ReactNode; // Custom button renderer
  createOrderUrl?: string;
  createOrderData?: Record<string, unknown>;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (response: { error: unknown }) => void) => void;
    };
  }
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  amount,
  currency = "INR",
  name = "Kashmir Handicrafts",
  description,
  image,
  prefill,
  notes,
  onInitiate,
  onSuccess,
  onFailure,
  buttonText = "Pay Now",
  className = "",
  disabled = false,
  renderButton,
  createOrderUrl,
  createOrderData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (window.Razorpay) {
      setIsSdkLoaded(true);
    }
  }, []);

  const handleLoad = () => {
    setIsSdkLoaded(true);
  };

  const handleScriptError = () => {
    console.error("Failed to load Razorpay SDK script.");
    if (onFailure) {
      onFailure(new Error("Unable to load the payment gateway SDK. Please check your internet connection or disable ad-blockers."));
    }
  };

  const handlePayment = async () => {
    if (onInitiate) {
      onInitiate();
    }

    if (!isSdkLoaded) {
      if (onFailure) {
        onFailure(new Error("Payment gateway SDK is still loading or was blocked. Please refresh and try again."));
      } else {
        alert("Payment gateway SDK is still loading or was blocked. Please refresh and try again.");
      }
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create Order via Backend (Protected Route)
      const url = createOrderUrl || "/payment/create-order";
      const body = createOrderUrl
        ? createOrderData
        : {
            amount: amount * 100, // Convert to paise
            currency,
            notes,
          };
      const { data } = await api.post(url, body);
      const resData = data?.data ?? data;

      // Normalize response shape across different endpoint returns
      const orderId = resData?.orderId ?? resData?.order?.id ?? resData?.razorpayOrderId;
      const intentId = resData?.donationIntentId ?? resData?.intentId;
      const keyId = resData?.keyId ?? resData?.key ?? resData?.key_id ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const orderAmount = resData?.order?.amount ?? (amount * 100);
      const orderCurrency = resData?.currency ?? resData?.order?.currency ?? currency;

      if (!orderId || !keyId) {
        throw new Error(resData?.message || resData?.error || data?.message || data?.error || "Invalid online payment order response from server.");
      }

      // 2. Initialize Razorpay Options
      const options = {
        key: keyId,
        amount: orderAmount,
        currency: orderCurrency,
        name: name,
        description: description,
        image: image,
        order_id: orderId,
        handler: async function (response: Record<string, unknown>) {
          // 3. Verify Payment via Backend
          try {
            const verifyEndpoint = createOrderUrl ? "/donation/verify-payment" : "/payment/verify-payment";
            const verifyPayload = {
              donationIntentId: intentId,
              ...response,
            };
            const { data: verifyData } = await api.post(verifyEndpoint, verifyPayload);

            if (verifyData.success) {
              onSuccess({ ...verifyData, donationIntentId: intentId });
            } else {
              if (onFailure) onFailure(verifyData);
              else alert("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            if (onFailure) onFailure(error);
            else alert("Error verifying payment signature");
          } finally {
            setIsLoading(false);
          }
        },
        prefill: prefill,
        notes: notes,
        theme: {
          color: "#A06B49", // Brand Color
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: { error: unknown }) {
        const errorPayload = response?.error || response || { message: "Payment was declined or cancelled in gateway checkout." };
        console.error("Payment Failed:", errorPayload);
        if (onFailure) onFailure(errorPayload);
        setIsLoading(false);
      });
      rzp.open();
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      const httpStatus = err.response?.status;
      if (httpStatus === 503 || httpStatus === 502) {
        // 503 = payment provider unconfigured; 502 = Razorpay order API failure.
        // Both are expected in pre-production / test environments. onFailure shows the user-facing message.
        console.info(`[Donation] Online payment initiation returned HTTP ${httpStatus}. Handing off to onFailure.`);
      } else {
        console.error("Payment Initiation Error:", error);
      }
      setIsLoading(false);
      if (onFailure) {
        onFailure(error);
      } else {
        const msg = getPaymentErrorMessage(error);
        alert(msg);
      }
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={handleLoad}
        onError={handleScriptError}
        strategy="lazyOnload"
      />
      {renderButton ? (
        renderButton(handlePayment, isLoading)
      ) : (
        <button
          onClick={handlePayment}
          disabled={isLoading || disabled || !isSdkLoaded}
          className={`bg-brand-dark text-white py-3 px-6 rounded-lg font-bold hover:bg-brand-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          {isLoading ? "Processing..." : buttonText}
        </button>
      )}
    </>
  );
};

export default RazorpayCheckout;
