"use client";

import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import BusinessRegistrationForm from "@/components/business/BusinessRegistrationForm";

export default function RegistrationPage() {
    return (
        <main>
            <UniversalEditorialHero pageKey="auto-generated-page" fallbackConfig={{
          id: 'auto-generated-page-fallback',
          pageKey: 'auto-generated-page',
          autoplayEnabled: false,
          autoplayIntervalMs: 6000,
          slides: [
            {
              id: 'slide-1',
              internalName: 'Auto Slide',
              eyebrow: 'PAGE',
              titleLineOne: 'BUSINESS REGISTRATION',
              titleConnector: '',
              titleLineTwo: 'JOIN THE NETWORK',
              description: 'Register your business, craft, or institution to access KHCRF support, grants, and certification programs.'
            }
          ]
        }} />
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <BusinessRegistrationForm />
                </div>
            </section>
        </main>
    );
}
