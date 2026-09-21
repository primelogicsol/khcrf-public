const cp = require('child_process');

const scripts = [
  'fix_ui3.js',
  'fix_ui4.js',
  'restore_status.js',
  'fix_filter1.js',
  'fix_reg.js',
  'fix_reg_btn.js',
  'fix_btn_text.js',
  'fix_status.js',
  'fix_dateranges.js',
  'fix_dropdowns.js',
  'clean_setters.js',
  'fix_ref.js',
  'fix_craft_filter.js',
  'virtual_craft_tags.js',
  'fix_all_crafts.js',
  'inject_card_tags.js',
  'inject_calendar_tags.js',
  'fix_filters.js',
  'fix_btn_logic.js',
  'fix_bg.js',
  'fix_reg_filter.js',
  'fix_deps.js',
  'fix_ui_reg_safe.js',
  'restore_filtered_hearings.js',
  'add_show_more.js',
  'add_expanded_state.js',
  'insert_participate.js'
];

console.log("Checking out file...");
cp.execSync('git checkout "frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx"');

for (const s of scripts) {
  console.log("Running " + s);
  try {
    const out = cp.execSync('node ' + s);
  } catch (e) {
    console.log("Error in " + s);
  }
}
