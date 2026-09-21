import re

with open("frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix `isApproved` logic
content = content.replace(
    "const isApproved = effectiveUser.isAdmin || (hasReg && (regStatus === 'APPROVED' || regStatus === 'VERIFIED' || regStatus === 'ACTIVE'));",
    "const isApproved = hasReg && (regStatus === 'APPROVED' || regStatus === 'VERIFIED' || regStatus === 'ACTIVE');"
)

# Fix preview mode for Public Landing
# The user wants "Public Landing" to show the public page if previewCategory is empty or "Public Landing".
# Currently, it shows it if !effectiveUser.
# Let's override `effectiveUser` to be `null` if we are previewing "Public Landing" (i.e. previewCategory is empty and impersonatedUser is null).
user_override = """
  const category = isPreviewing ? (impersonatedUser ? impersonatedUser.categoryLabel : previewCategory) : realCategory;
"""

new_user_override = """
  const isPublicLandingPreview = isPreviewing && !impersonatedUser && !previewCategory;
  const effectiveUser = isPublicLandingPreview ? null : ((isPreviewing && impersonatedUser) ? { ...user, ...impersonatedUser, isAdmin: false } : user);
"""
content = content.replace(
    "const effectiveUser = (isPreviewing && impersonatedUser) ? { ...user, ...impersonatedUser, isAdmin: false } : user;",
    new_user_override
)

# Ensure regData overrides for impersonatedUser or category-based mocking.
regData_mock = """const regData = isPreviewing ? (impersonatedUser || { approvedParticipationModes: previewModes }) : realRegData;"""
new_regData_mock = """const regData = isPreviewing ? (impersonatedUser || { 
    approvedParticipationModes: previewModes,
    categoryLabel: previewCategory,
    status: previewStatus,
    referenceNumber: "SKC-PREVIEW-0000",
    registrationType: "INDIVIDUAL"
  }) : realRegData;"""
content = content.replace(regData_mock, new_regData_mock)

# Also fix the regStatus logic.
regStatus_mock = """const regStatus = isPreviewing ? (impersonatedUser ? impersonatedUser.status : (previewStatus === 'NOT_REGISTERED' ? '' : previewStatus)) : realRegStatus;"""
content = content.replace(regStatus_mock, "const regStatus = isPreviewing ? (impersonatedUser ? impersonatedUser.status : previewStatus) : realRegStatus;")

# Now replace the generic Access Denied screen with specialized screens.
access_denied_block = """  if (!isApproved) {
    return (
      <main className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <FaExclamationCircle className="text-3xl text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">Access Denied</h3>
          <p className="text-sm text-gray-500 font-semibold">You do not have the required approval status to access this page.</p>
        </div>
      </main>
    );
  }"""

lifecycle_screens = """
  if (!isApproved) {
    const status = regStatus.toUpperCase();
    
    if (status === 'PENDING') {
      return (
        <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800 pt-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 md:p-12 space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                <FaHourglassHalf className="text-2xl" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Registration Pending Verification</h2>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left space-y-2 mb-4">
                <p className="text-sm text-gray-600"><strong>Participant:</strong> {regData?.fullName || regData?.representativeName || 'Approved Participant'}</p>
                <p className="text-sm text-gray-600"><strong>Reference Number:</strong> {regData?.referenceNumber || regRef}</p>
                <p className="text-sm text-gray-600"><strong>Submitted Category:</strong> {regData?.categoryLabel || 'Not specified'}</p>
                <p className="text-sm text-gray-600"><strong>Status:</strong> <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">Pending Verification</span></p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed font-semibold max-w-md mx-auto">
                Your registration is currently awaiting verification by the Assessment Secretariat. You will be notified once it has been processed.
              </p>
              <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/state-of-kashmir-crafts/contact-secretariat" className="px-6 py-3 bg-[#050a1e] text-white font-bold rounded-xl hover:bg-gray-800 transition uppercase tracking-wider text-xs">
                  Contact Secretariat
                </Link>
              </div>
            </div>
          </div>
        </main>
      );
    }
    
    if (status === 'UNDER_REVIEW') {
      return (
        <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800 pt-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8 md:p-12 space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 text-purple-600 border border-purple-200">
                <FaSearch className="text-2xl" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Registration Under Secretariat Review</h2>
              <p className="text-sm text-gray-600 leading-relaxed font-semibold max-w-md mx-auto">
                Your record is actively being assessed by the Secretariat. Authorized tasks will be available upon approval.
              </p>
              <div className="bg-purple-50 text-purple-800 px-4 py-2 rounded-lg font-bold text-xs inline-block mt-4 uppercase tracking-wider">
                Workspace Access: Restricted
              </div>
            </div>
          </div>
        </main>
      );
    }
    
    if (status === 'REVISION_REQUIRED') {
      return (
        <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800 pt-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-8 md:p-12 space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                <FaExclamationCircle className="text-2xl" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Revision Required</h2>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-left space-y-2 mb-4">
                <p className="text-sm text-gray-600"><strong>Reference:</strong> {regData?.referenceNumber || regRef}</p>
                <p className="text-sm text-gray-600"><strong>Category:</strong> {regData?.categoryLabel || 'Not specified'}</p>
                <div className="bg-white p-3 rounded border border-amber-200 mt-2">
                  <p className="text-xs text-amber-800 font-bold mb-1 uppercase">Secretariat Note:</p>
                  <p className="text-sm text-gray-700">Please provide updated documentation to support your registration claim. The current submission is incomplete.</p>
                </div>
              </div>
              <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-6 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition uppercase tracking-wider text-xs">
                  Review and Update Registration
                </button>
              </div>
            </div>
          </div>
        </main>
      );
    }
    
    if (status === 'REJECTED') {
      return (
        <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800 pt-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-8 md:p-12 space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 border border-red-200">
                <FaTimes className="text-2xl" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Registration Not Approved</h2>
              <p className="text-sm text-gray-600 leading-relaxed font-semibold max-w-md mx-auto">
                After careful review, the Assessment Secretariat was unable to approve this registration for the current assessment cycle.
              </p>
              <div className="bg-red-50 text-red-800 px-4 py-2 rounded-lg font-bold text-xs inline-block mt-4 uppercase tracking-wider">
                Workspace Access: Inactive
              </div>
              <div className="pt-6 flex flex-col justify-center">
                <Link href="/state-of-kashmir-crafts/contact-secretariat" className="text-brand-primary font-bold text-sm hover:underline">
                  Appeal Instructions or Contact Secretariat
                </Link>
              </div>
            </div>
          </div>
        </main>
      );
    }
    
    if (status === 'SUSPENDED') {
      return (
        <main className="w-full bg-gray-50 min-h-screen pb-20 text-gray-800 pt-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12 space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-600 border border-gray-300">
                <FaLock className="text-2xl" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Registration Suspended</h2>
              <p className="text-sm text-gray-600 leading-relaxed font-semibold max-w-md mx-auto">
                Access to this participant workspace has been temporarily restricted. Please refer to Secretariat instructions.
              </p>
              <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold text-xs inline-block mt-4 uppercase tracking-wider">
                Workspace Access: Suspended
              </div>
            </div>
          </div>
        </main>
      );
    }

    // Fallback if status doesn't match predefined lifecycles
    return (
      <main className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <FaExclamationCircle className="text-3xl text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">Access Denied</h3>
          <p className="text-sm text-gray-500 font-semibold">Status '{status}' does not have workspace access.</p>
        </div>
      </main>
    );
  }
"""

content = content.replace(access_denied_block, lifecycle_screens)

# Fix hasReg logic for NOT_REGISTERED
hasReg_mock = "const hasReg = isPreviewing ? (previewStatus !== 'NOT_REGISTERED' || !!impersonatedUser) : realHasReg;"
new_hasReg_mock = "const hasReg = isPreviewing ? (previewStatus !== 'NOT_REGISTERED') : realHasReg;"
content = content.replace(hasReg_mock, new_hasReg_mock)

with open("frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated lifecycle screens")
