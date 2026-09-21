"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-lg mb-12">
            **Effective Date:** {currentDate}
          </p>

          <div className="space-y-12 text-gray-700 leading-relaxed text-lg">
            <section>
              <p className="mb-6">
                <strong className="text-brand-primary">
                  Hamadan Craft Revival Foundation (KHCRF)
                </strong>{" "}
                respects your privacy and is committed to handling personal data
                responsibly and transparently. This Privacy Policy explains how
                information is collected, used, stored, and protected when you
                access or use{" "}
                <strong className="text-brand-primary">khcrf.org</strong>.
              </p>
              <p>
                By using this website, you agree to the practices described in
                this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                1. Who We Are
              </h2>
              <p className="mb-4">
                <strong>Hamadan Craft Revival Foundation (KHCRF)</strong> is a
                public-interest, non-profit organization engaged in research,
                documentation, policy advocacy, and ecosystem development for
                traditional crafts and artisan communities, with a primary focus
                on the Kashmir region.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                <p>
                  Website:{" "}
                  <a
                    href="https://khcrf.org"
                    className="text-brand-primary hover:underline"
                  >
                    https://khcrf.org
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:info@khcrf.org"
                    className="text-brand-primary hover:underline"
                  >
                    info@khcrf.org
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                2. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information only to the extent necessary to operate
                our website and fulfill our public-interest mission.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-brand-dark mb-2">
                    A. Information You Provide Directly
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>Name, email address, phone number</li>
                    <li>Institutional or organizational details</li>
                    <li>Membership registration information</li>
                    <li>
                      Submissions to registries, applications, surveys, or
                      campaigns
                    </li>
                    <li>Communications sent via contact forms or email</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-brand-dark mb-2">
                    B. Automatically Collected Information
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    When you visit the website, we may collect:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>IP address</li>
                    <li>Browser type and device information</li>
                    <li>Pages visited and time spent</li>
                    <li>Referring URLs</li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-2 italic">
                    This data is used for security, analytics, and performance
                    improvement.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                3. How We Use Information
              </h2>
              <p className="mb-4">
                KHCRF uses collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>To operate and maintain the website</li>
                <li>
                  To provide access to publications, memberships, and resources
                </li>
                <li>To process registrations, submissions, or applications</li>
                <li>To communicate updates, notices, or responses</li>
                <li>To improve site performance, usability, and security</li>
                <li>To support research, documentation, and policy analysis</li>
              </ul>
              <p className="font-medium text-brand-dark">
                We do <strong>not</strong> sell personal data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                4. Legal Basis for Processing
              </h2>
              <p className="mb-4">
                Where applicable, personal data is processed on the basis of:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>User consent</li>
                <li>
                  Legitimate interests related to research, advocacy, and
                  platform integrity
                </li>
                <li>Compliance with legal or regulatory obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                5. Cookies and Analytics
              </h2>
              <p className="mb-4">
                KHCRF may use cookies or similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>Maintain session functionality</li>
                <li>Understand website usage patterns</li>
                <li>Improve content and performance</li>
              </ul>
              <p>
                Cookies do not collect sensitive personal data. You may control
                cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                6. Data Sharing and Disclosure
              </h2>
              <p className="mb-4">
                KHCRF does <strong>not</strong> sell or rent personal
                information.
              </p>
              <p className="mb-4">We may share data only:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>
                  With trusted service providers (hosting, analytics, payments)
                  strictly for operational purposes
                </li>
                <li>When required by law, regulation, or legal process</li>
                <li>
                  To protect the rights, safety, or integrity of KHCRF, users, or
                  the public
                </li>
              </ul>
              <p>
                All third parties are expected to adhere to appropriate data
                protection standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                7. Data Storage and Security
              </h2>
              <p className="mb-4">
                Personal data is stored using reasonable administrative,
                technical, and organizational safeguards.
              </p>
              <p className="mb-2">Measures include:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>Secure servers and access controls</li>
                <li>Encryption where appropriate</li>
                <li>Restricted access to authorized personnel only</li>
              </ul>
              <p className="mt-4">
                No system is completely secure, but we take reasonable steps to
                protect data from unauthorized access, misuse, or loss.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                8. Data Retention
              </h2>
              <p className="mb-4">
                We retain personal data only for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>Fulfill the purposes described in this Policy</li>
                <li>Meet legal, regulatory, or reporting obligations</li>
              </ul>
              <p>
                Data may be anonymized or archived for research and historical
                purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                9. Your Rights
              </h2>
              <p className="mb-4">
                Subject to applicable law, you may have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>Access personal data we hold about you</li>
                <li>Request correction or update of inaccurate data</li>
                <li>Request deletion of personal data, where appropriate</li>
                <li>Withdraw consent for certain processing activities</li>
              </ul>
              <p>
                Requests can be made by contacting us at{" "}
                <a
                  href="mailto:info@khcrf.org"
                  className="text-brand-primary hover:underline"
                >
                  info@khcrf.org
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                10. Research, Registries, and Public-Interest Data
              </h2>
              <p className="mb-4">
                Some information submitted to registries or research initiatives
                may be:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>Aggregated</li>
                <li>Anonymized</li>
                <li>Published in reports or datasets</li>
              </ul>
              <p>
                KHCRF takes care to avoid publishing personally identifiable
                information unless consent is given or disclosure is required by
                law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                11. Third-Party Links
              </h2>
              <p className="mb-4">
                The website may contain links to third-party websites or tools.
                KHCRF is not responsible for the privacy practices or content of
                third parties.
              </p>
              <p>
                Users should review third-party privacy policies separately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                12. Children’s Privacy
              </h2>
              <p className="mb-4">
                This website is not directed at children under 18.
              </p>
              <p>
                KHCRF does not knowingly collect personal data from minors
                without appropriate consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                13. International Users
              </h2>
              <p>
                Users accessing this website from outside India acknowledge that
                their data may be processed and stored in jurisdictions with
                different data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                14. Changes to This Privacy Policy
              </h2>
              <p className="mb-2">
                KHCRF may update this Privacy Policy from time to time.
              </p>
              <p className="mb-2">
                Updates will be posted on this page with a revised effective
                date.
              </p>
              <p>
                Continued use of the website after changes constitutes
                acceptance of the updated Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                15. Contact Information
              </h2>
              <p className="mb-4">
                For privacy-related questions, requests, or concerns:
              </p>
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
