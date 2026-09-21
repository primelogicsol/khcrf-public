import React from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Icon } from '@/components/ui/Icon';
import { Search, Menu, Info, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

export default function FixturesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="pb-8 border-b border-gray-200">
        <h1 className="text-4xl font-bold mb-2">Design System Fixtures</h1>
        <p className="text-gray-600">Internal development surface for Phase 2B validations. Not linked in production navigation.</p>
      </header>

      {/* Brand Logos */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">1. Brand Logo Matrix</h2>
        <p className="text-sm text-gray-500">Testing dark/light variants against navy and slate surfaces.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 border border-gray-100 rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Light Surface</h3>
            <div className="space-y-8">
               <div>
                  <p className="text-xs text-gray-500 mb-2">Primary (Dark Text)</p>
                  <BrandLogo variant="primary-full" surface="light" size="md" />
               </div>
               <div>
                  <p className="text-xs text-gray-500 mb-2">Wordmark</p>
                  <BrandLogo variant="wordmark" surface="light" size="md" />
               </div>
            </div>
          </div>
          
          <div className="bg-[#050A1E] p-8 border border-gray-800 rounded-lg shadow-sm text-white">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Dark Surface (Navy)</h3>
            <div className="space-y-8">
               <div>
                  <p className="text-xs text-gray-500 mb-2">Primary (White Text)</p>
                  <BrandLogo variant="primary-full" surface="dark" size="md" />
               </div>
               <div>
                  <p className="text-xs text-gray-500 mb-2">Wordmark</p>
                  <BrandLogo variant="wordmark" surface="dark" size="md" />
               </div>
            </div>
          </div>
          <section className="space-y-6 pt-12 border-t border-gray-200">
        <h2 className="text-2xl font-semibold">2. Icon Component Matrix</h2>
        <p className="text-sm text-gray-500">Governed tones and sizes for consistent UI iconography.</p>
        
        <div className="bg-white p-8 border border-gray-100 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-500">Tones (md size)</h4>
              <div className="flex items-center gap-4"><Icon name="search" lucideIcon={Search} tone="primary" /> Primary</div>
              <div className="flex items-center gap-4"><Icon name="menu" lucideIcon={Menu} tone="secondary" /> Secondary</div>
              <div className="flex items-center gap-4"><Icon name="info" lucideIcon={Info} tone="information" /> Information</div>
              <div className="flex items-center gap-4"><Icon name="alert-circle" lucideIcon={AlertTriangle} tone="warning" /> Warning</div>
              <div className="flex items-center gap-4"><Icon name="check" lucideIcon={CheckCircle} tone="success" /> Success</div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-500">Sizes (inherit tone)</h4>
              <div className="flex items-center gap-4 text-blue-500"><Icon name="search" lucideIcon={Search} size="sm" /> Small (16px)</div>
              <div className="flex items-center gap-4 text-blue-500"><Icon name="search" lucideIcon={Search} size="md" /> Medium (24px)</div>
              <div className="flex items-center gap-4 text-blue-500"><Icon name="search" lucideIcon={Search} size="lg" /> Large (32px)</div>
              <div className="flex items-center gap-4 text-blue-500"><Icon name="search" lucideIcon={Search} size="xl" /> Extra Large (48px)</div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
      </section>
      
    </div>
  );
}
