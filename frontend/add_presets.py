import re

path = "frontend/src/app/(main)/state-of-kashmir-crafts/participate/AdminPreviewToolbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Import the data
import_block = "import { PREVIEW_SCENARIOS } from '@/lib/skc/preview-data';\nimport { PARTICIPANT_CATEGORIES } from '@/lib/skc/participant-categories';"
content = content.replace("import { PARTICIPANT_CATEGORIES } from '@/lib/skc/participant-categories';", import_block)

# Add Preset Dropdown UI
preset_ui = """
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-4 bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-4">
            <label className="text-xs text-orange-400 font-bold uppercase tracking-wider whitespace-nowrap"><FaExclamationTriangle className="inline mr-1" /> Scenario Preset:</label>
            <select 
              className="w-full bg-gray-900 border border-gray-600 text-white rounded p-1.5 text-sm focus:outline-none focus:border-orange-500"
              onChange={(e) => {
                const scenario = PREVIEW_SCENARIOS.find(s => s.id === e.target.value);
                if (scenario) {
                  onPreviewCategory(scenario.category);
                  onPreviewStatus(scenario.status);
                  onPreviewModes(scenario.modes);
                  onImpersonate(null);
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>-- Select a testing scenario --</option>
              {PREVIEW_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
"""

content = content.replace('<div className="grid grid-cols-1 md:grid-cols-4 gap-6">', preset_ui)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AdminPreviewToolbar with Scenario Presets")
