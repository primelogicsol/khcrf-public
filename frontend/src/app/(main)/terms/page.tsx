"use client";

import React from "react";
import { motion } from "framer-motion";

export default function LegalPage() {
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
            Legal
          </h1>
          <p className="text-gray-500 text-lg mb-12">
            **Effective Date:** {currentDate}
          </p>

          <div className="space-y-12 text-gray-700 leading-relaxed text-lg">
            <section>
              <p className="mb-6">
                This page sets out the legal terms, policies, and disclosures
                governing access to and use of{" "}
                <strong className="text-brand-primary">khcrf.org</strong>, the
                official website of the{" "}
                <strong className="text-brand-primary">
                  Hamadan Craft Revival Foundation (KHCRF)
                </strong>
                .
              </p>
              <p>
                By accessing or using this website, you agree to the terms
                outlined below. If you do not agree, please discontinue use of
                the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                1. About Hamadan Craft Revival Foundation (KHCRF)
              </h2>
              <p className="mb-4">
                Hamadan Craft Revival Foundation (KHCRF) is a public-interest,
                non-profit organization engaged in research, documentation,
                policy advocacy, and ecosystem development for traditional
                crafts and artisan communities, with a primary focus on the
                Kashmir region.
              </p>
              <p className="font-medium bg-gray-50 p-4 rounded-lg border-l-4 border-[var(--card-left-accent)]">
                KHCRF is <strong>not</strong> a marketplace, broker, reseller, or
                commercial intermediary for the sale of goods or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                2. Terms of Use
              </h2>
              <p className="mb-4">
                These Terms of Use govern your access to and use of:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>This website and its subdomains</li>
                <li>
                  Research publications, reports, datasets, and registries
                </li>
                <li>
                  Campaigns, educational resources, and public-interest content
                </li>
                <li>
                  Membership, institutional, and participation features (where
                  applicable)
                </li>
              </ul>
              <p>
                Use of the website is permitted only for lawful, ethical, and
                non-misleading purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                3. Eligibility and User Responsibility
              </h2>
              <p className="mb-4">By using this website, you confirm that:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>
                  You are at least 18 years of age, or have lawful guardian
                  consent
                </li>
                <li>Information you provide is accurate and lawful</li>
                <li>You will not misuse content, data, or platform features</li>
              </ul>
              <p>
                Where accounts are created, you are responsible for maintaining
                the confidentiality of login credentials and all activity under
                your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                4. Nature of Content and No Professional Advice
              </h2>
              <p className="mb-4">Unless expressly stated otherwise:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>
                  All content is provided for{" "}
                  <strong>
                    informational, research, educational, and advocacy purposes
                    only
                  </strong>
                </li>
                <li>
                  Nothing on this website constitutes legal, financial, medical,
                  or professional advice
                </li>
                <li>
                  KHCRF does not guarantee outcomes, funding, policy adoption,
                  commercial success, or regulatory recognition based on website
                  content or participation
                </li>
              </ul>
              <p>
                Users should independently verify information before relying on
                it for decision-making.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                5. Intellectual Property Rights
              </h2>
              <p className="mb-4">
                All content on khcrf.org, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>
                  Text, publications, datasets, reports, and methodologies
                </li>
                <li>Graphics, logos, visual identity, and UI elements</li>
                <li>
                  Campaign materials, frameworks, and documentation systems
                </li>
              </ul>
              <p className="mb-6">
                is the intellectual property of KHCRF or its licensors, unless
                otherwise stated.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-brand-dark mb-2">
                    Permitted use
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>
                      Viewing, sharing, and citing public content with proper
                      attribution
                    </li>
                    <li>
                      Academic or policy citation using standard referencing
                      formats
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-brand-dark mb-2">
                    Prohibited use
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>
                      Commercial reproduction, resale, scraping, or
                      redistribution without written permission
                    </li>
                    <li>
                      Misrepresentation of KHCRF content as endorsement of
                      third-party products, services, or positions
                    </li>
                    <li>Removal of copyright, attribution, or legal notices</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                6. User Submissions and Contributions
              </h2>
              <p className="mb-4">
                If you submit information, data, applications, feedback, or
                materials to KHCRF:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>
                  You confirm you have the legal right to submit such content
                </li>
                <li>
                  You grant KHCRF a non-exclusive, royalty-free right to review,
                  store, analyze, and use submissions for its public-interest
                  mission
                </li>
                <li>
                  KHCRF is under no obligation to publish, accept, or act upon
                  submissions
                </li>
              </ul>
              <p>
                KHCRF reserves the right to reject, edit, or remove submissions
                at its discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                7. Memberships, Fees, and Donations
              </h2>
              <p className="mb-4">
                Certain features or publications may require:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>Paid membership</li>
                <li>Institutional access</li>
                <li>Voluntary donations</li>
              </ul>
              <p className="mb-4">
                All payments are processed via approved third-party payment
                providers. Unless expressly stated otherwise, fees are
                non-refundable.
              </p>
              <p>
                Membership benefits, pricing, and access terms may change from
                time to time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                8. Campaigns and Advocacy
              </h2>
              <p className="mb-4">
                Campaigns hosted on this website represent KHCRF’s advocacy
                positions and public-interest objectives.
              </p>
              <p className="mb-4">Participation in campaigns:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>
                  Does not create a legal partnership, agency, or fiduciary
                  relationship
                </li>
                <li>
                  Does not guarantee funding, policy outcomes, or institutional
                  adoption
                </li>
                <li>
                  Is voluntary and subject to campaign-specific terms, where
                  applicable
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                9. Data, Registries, and Accuracy
              </h2>
              <p className="mb-4">
                KHCRF strives to ensure integrity and accuracy of published data
                and registries. However:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>
                  Data may rely on third-party sources, submissions, or evolving
                  research
                </li>
                <li>
                  Information may be incomplete, provisional, or subject to
                  revision
                </li>
                <li>
                  KHCRF does not warrant that all data is current or error-free
                </li>
              </ul>
              <p>
                KHCRF reserves the right to update, correct, or withdraw data at
                any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                10. Acceptable Use Policy
              </h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>
                  Use the website for unlawful, harmful, or deceptive purposes
                </li>
                <li>
                  Attempt unauthorized access to systems, data, or accounts
                </li>
                <li>
                  Interfere with platform security, availability, or performance
                </li>
                <li>
                  Scrape, crawl, or automate data extraction without permission
                </li>
              </ul>
              <p>
                Violations may result in suspension, termination, or legal
                action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                11. Third-Party Links and Services
              </h2>
              <p className="mb-4">
                This website may link to third-party websites or tools. KHCRF is
                not responsible for third-party content, policies, or practices.
              </p>
              <p>Accessing third-party services is at your own risk.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                12. Disclaimer of Warranties
              </h2>
              <p className="mb-4">
                This website is provided{" "}
                <strong>“as is” and “as available.”</strong>
              </p>
              <p className="mb-4">
                KHCRF makes no warranties, express or implied, regarding:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>Availability or uninterrupted operation</li>
                <li>Accuracy or completeness of content</li>
                <li>Fitness for any particular purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                13. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by law, KHCRF shall not be liable
                for any indirect, incidental, consequential, or special damages
                arising from use of this website, including loss of data,
                opportunity, or reputation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                14. Termination of Access
              </h2>
              <p className="mb-4">
                KHCRF may suspend or terminate access to the website or its
                services:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-brand-primary">
                <li>For violation of these legal terms</li>
                <li>For security, legal, or operational reasons</li>
                <li>At its discretion, with or without notice</li>
              </ul>
              <p>
                Termination does not affect rights or obligations that by nature
                survive termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                15. Governing Law and Jurisdiction
              </h2>
              <p className="mb-2">
                This Legal page and all use of the website shall be governed by
                and construed in accordance with the laws of{" "}
                <strong>India</strong>.
              </p>
              <p>
                Courts of competent jurisdiction in India shall have exclusive
                jurisdiction, unless otherwise required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                16. Changes to Legal Terms
              </h2>
              <p className="mb-2">
                KHCRF may update this Legal page from time to time.
              </p>
              <p className="mb-2">
                Continued use of the website after updates constitutes
                acceptance of the revised terms.
              </p>
              <p>The effective date will be updated accordingly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-secondary mb-4">
                17. Legal Contact
              </h2>
              <p className="mb-4">
                For legal, compliance, or policy-related queries:
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
