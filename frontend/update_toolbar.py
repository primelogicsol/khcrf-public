import re

path = "frontend/src/app/(main)/state-of-kashmir-crafts/participate/AdminPreviewToolbar.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add SUSPENDED
content = content.replace(
    '<option value="REJECTED">Rejected</option>',
    '<option value="REJECTED">Rejected</option>\n                <option value="SUSPENDED">Suspended</option>'
)

# Rename Quick Impersonate
content = content.replace(
    'Quick Impersonate',
    'Preview Actual Participant'
)

# Improve minimized state
compact_state = """  if (!expanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-orange-500/50 text-white p-2 z-[9999] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2 text-orange-400">
            <FaExclamationTriangle /> ADMIN PREVIEW
          </div>
          <div className="h-4 w-px bg-gray-700"></div>
          <div className="text-gray-300 truncate max-w-[200px]">
            {impersonatedUser ? `Impersonating: ${impersonatedUser.name}` : (currentCategory || "Public Landing")}
          </div>
          <div className="h-4 w-px bg-gray-700"></div>
          <div className={
            currentStatus === 'APPROVED' ? 'text-emerald-400' :
            currentStatus === 'PENDING' ? 'text-blue-400' :
            currentStatus === 'REJECTED' || currentStatus === 'SUSPENDED' ? 'text-red-400' :
            'text-amber-400'
          }>
            {impersonatedUser ? impersonatedUser.status : currentStatus.replace('_', ' ')}
          </div>
          <div className="h-4 w-px bg-gray-700"></div>
          <div className="text-gray-400">
            {currentModes.length} Mode{currentModes.length !== 1 ? 's' : ''}
          </div>
          <div className="flex-grow"></div>
          <div className="flex gap-2">
            <button 
              onClick={() => setExpanded(true)}
              className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded transition flex items-center gap-2"
            >
              <FaTools /> Expand Controls
            </button>
            <button 
              onClick={() => onExitPreview()}
              className="px-4 py-1.5 bg-red-900/50 hover:bg-red-800 text-red-200 rounded transition flex items-center gap-2"
            >
              <FaTimes /> Exit
            </button>
          </div>
        </div>
      </div>
    );
  }"""

old_compact_state = """  if (!expanded) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2">
        <div className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg">
          <FaExclamationTriangle /> PREVIEW ACTIVE
        </div>
        <button 
          onClick={() => setExpanded(true)}
          className="bg-gray-900 text-white p-3 rounded-xl shadow-xl hover:bg-black transition"
        >
          <FaTools />
        </button>
      </div>
    );
  }"""

content = content.replace(old_compact_state, compact_state)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated toolbar UI")
