import { describe, it, expect } from "vitest";
import { getPaymentErrorMessage } from "./paymentErrors";

describe("getPaymentErrorMessage", () => {
  it("should extract message from Axios response.data.message", () => {
    const err = {
      response: {
        data: {
          message: "Database connection failed",
        },
      },
    };
    expect(getPaymentErrorMessage(err)).toBe("Database connection failed");
  });

  it("should extract error from Axios response.data.error", () => {
    const err = {
      response: {
        data: {
          error: "Invalid transaction amount",
        },
      },
    };
    expect(getPaymentErrorMessage(err)).toBe("Invalid transaction amount");
  });

  it("should extract description from Razorpay error object", () => {
    const err = {
      error: {
        description: "Payment cancelled by user",
      },
    };
    expect(getPaymentErrorMessage(err)).toBe("Payment cancelled by user");
  });

  it("should extract message from standard Error instance", () => {
    const err = new Error("Network Timeout");
    expect(getPaymentErrorMessage(err)).toBe("Network Timeout");
  });

  it("should provide safe fallback when error object is empty or undefined", () => {
    expect(getPaymentErrorMessage(undefined)).toBe(
      "We could not complete the payment. Please try again or select an alternative contribution method."
    );
    expect(getPaymentErrorMessage({})).toBe(
      "We could not complete the payment. Please try again or select an alternative contribution method."
    );
  });

  it("should never return 'undefined', 'null', or '[object Object]'", () => {
    const testCases = [
      {},
      null,
      undefined,
      { description: undefined },
      { message: undefined },
      { error: { description: undefined } },
      { response: { data: {} } },
    ];

    for (const tc of testCases) {
      const res = getPaymentErrorMessage(tc);
      expect(res).not.toContain("undefined");
      expect(res).not.toContain("null");
      expect(res).not.toContain("[object Object]");
      expect(res.length).toBeGreaterThan(0);
    }
  });
});
