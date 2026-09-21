import React from 'react';

export function ClassificationFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  return (
    <div className="flex space-x-4 mb-4">
      <select onChange={(e) => onFilterChange({ entityType: e.target.value })} className="border rounded-md p-2 text-sm">
        <option value="">All Entity Types</option>
        <option value="SKC_STAKEHOLDER_REGISTRATION">Stakeholders</option>
        <option value="SKC_INSTITUTION_REGISTRATION">Institutions</option>
        <option value="SKC_HEARING">Hearings</option>
      </select>
      <select onChange={(e) => onFilterChange({ sourceSystem: e.target.value })} className="border rounded-md p-2 text-sm">
        <option value="">All Sources</option>
        <option value="ONLINE_PORTAL">Online Portal</option>
        <option value="LEGACY_IMPORT">Legacy Import</option>
      </select>
      <input type="text" placeholder="Search by name or reference..." className="border rounded-md p-2 text-sm flex-1" />
    </div>
  );
}
