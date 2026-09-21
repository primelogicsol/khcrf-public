"use client";

import React from "react";
import { motion } from "framer-motion";

export default function RefundPolicyPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gray-50 min-h-screen py-16 font-manrope">
      <div className="container mx-auto px-4 md:px-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100"
        >
          <h1 className="text-4xl md:text-5xl font-black text-brand-dark mb-4">
            Refund Policy
          </h1>
          <p className="text-gray-500 text-lg mb-12">
            **Effective Date:** {currentDate}
          </p>

          <div className="space-y-12 text-gray-700 leading-relaxed text-lg">
            <section>
              <p className="mb-6">
                This Refund Policy applies to payments made on{" "}
                <strong className="text-brand-primary">khcrf.org</strong>, the
                official website of the{" "}
                <strong className="text-brand-primary">
                  Hamadan Craft Revival Foundation (KHCRF)
                </strong>
                . It explains how refunds are handled for memberships,
                publications, donations, and other paid services.
              </p>
              <p>
                By making a payment on this website, you acknowledge and agree
                to this Refund Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                1. General Policy
              </h2>
              <p className="mb-4">
                KHCRF operates as a public-interest, research, and advocacy
                organization. Payments received support ongoing research,
                documentation, campaigns, publications, and institutional
                activities.
              </p>
              <p className="font-medium bg-gray-50 p-4 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                Accordingly, <strong>all payments are considered final</strong>,
                except where explicitly stated in this Policy or required by
                applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                2. Membership Fees
              </h2>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                a. Digital Memberships
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-brand-primary">
                <li>
                  Membership fees are <strong>non-refundable</strong> once
                  access to member content, publications, or benefits has been
                  activated.
                </li>
                <li>
                  This includes partial use, non-use, or cancellation during the
                  membership period.
                </li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                b. Institutional or Group Memberships
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>
                  Institutional memberships are non-refundable once onboarding,
                  access credentials, or documentation has been issued.
                </li>
                <li>Any exceptions must be approved in writing by KHCRF.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                3. Publications, Reports, and Digital Content
              </h2>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>
                  Payments for downloadable or digital publications, reports,
                  datasets, or research materials are{" "}
                  <strong>non-refundable</strong>.
                </li>
                <li>
                  Once access is granted or a file is downloaded, no refund will
                  be issued under any circumstances.
                </li>
              </ul>
              <p>
                This includes pricing errors, user misunderstanding of content
                scope, or compatibility issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                4. Donations and Contributions
              </h2>
              <p className="mb-4">
                All donations made to KHCRF are{" "}
                <strong>voluntary and non-refundable</strong>.
              </p>
              <p className="mb-4">
                Donations support public-interest initiatives and are not
                payments for goods or services. As such:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>Donations cannot be reversed once processed</li>
                <li>
                  Donation receipts, where issued, reflect final contributions
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                5. Events, Programs, or Workshops (If Applicable)
              </h2>
              <p className="mb-4">
                If KHCRF hosts paid events, programs, or workshops, refund terms
                (if any) will be clearly stated on the relevant event page.
              </p>
              <p className="mb-4">Unless explicitly stated otherwise:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>Event registrations are non-refundable</li>
                <li>Non-attendance does not qualify for a refund</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                6. Duplicate or Erroneous Payments
              </h2>
              <p className="mb-4">
                Refunds may be considered in the following limited cases:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>Duplicate payments for the same service</li>
                <li>
                  Clearly erroneous transactions caused by technical issues
                </li>
              </ul>
              <p className="mb-4">
                Requests must be submitted within <strong>7 days</strong> of the
                transaction date and will be reviewed on a case-by-case basis.
              </p>
              <p>Approval of such refunds is at the sole discretion of KHCRF.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                7. Payment Processing Fees
              </h2>
              <p className="mb-4">Where refunds are exceptionally approved:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>
                  Any applicable payment gateway or processing fees may be
                  deducted
                </li>
                <li>
                  Refunds will be issued using the original payment method,
                  where possible
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                8. Chargebacks and Disputes
              </h2>
              <p className="mb-4">
                Users are encouraged to contact KHCRF before initiating a
                chargeback or payment dispute.
              </p>
              <p className="mb-4">
                Unauthorized or bad-faith chargebacks may result in:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>Suspension or termination of access</li>
                <li>Restriction from future participation or membership</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                9. Changes to This Refund Policy
              </h2>
              <p className="mb-2">
                KHCRF reserves the right to modify this Refund Policy at any
                time.
              </p>
              <p className="mb-2">
                Updates will be posted on this page with a revised effective
                date.
              </p>
              <p>
                Continued use of paid services after changes constitutes
                acceptance of the updated Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                10. Contact for Refund Queries
              </h2>
              <p className="mb-4">For refund-related questions or requests:</p>
              <div className="bg-gray-100 p-6 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900 mb-1">
                  Hamadan Craft Revival Foundation (KHCRF)
                </p>
                <p className="text-gray-700">
                  Email:{" "}
                  <a
                    href="mailto:info@khcrf.org"
                    className="text-brand-primary font-medium hover:underline"
                  >
                    info@khcrf.org
                  </a>
                </p>
                <p className="text-gray-700">
                  Website:{" "}
                  <a
                    href="https://khcrf.org"
                    className="text-brand-primary font-medium hover:underline"
                  >
                    https://khcrf.org
                  </a>
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
