/**
 * Standardized payment error message normalizer.
 * Prevents "Payment Failed: undefined" errors by inspecting response payload variations
 * before falling back to generic JavaScript Error properties.
 *
 * Backend wraps errors as: { status: "error", data: { message, code } }
 * Axios puts the parsed body into response.data, so we need to check:
 *   - response.data.data.message  (backend wrapped)
 *   - response.data.message       (flat message)
 *   - response.data.error         (legacy field)
 * Razorpay SDK errors come as: { error: { description, code } }
 */
export function getPaymentErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "We could not complete the payment. Please try again or select an alternative contribution method.";
  }

  const paymentError = error as {
    description?: string;
    message?: string;
    code?: string;
    error?: {
      description?: string;
      message?: string;
      code?: string;
    };
    response?: {
      data?: {
        error?: string;
        message?: string;
        code?: string;
        data?: {
          message?: string;
          code?: string;
        };
      };
    };
  };

  return (
    paymentError.response?.data?.data?.message ||
    paymentError.response?.data?.message ||
    paymentError.response?.data?.error ||
    paymentError.error?.description ||
    paymentError.error?.message ||
    paymentError.description ||
    paymentError.message ||
    "We could not complete the payment. Please try again or select an alternative contribution method."
  );
}
