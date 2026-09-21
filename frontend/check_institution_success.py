import re

path = 'frontend/src/components/forms/InstitutionRegistrationForm.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix successData typing and setting
# It says argument of type 'record' is missing referenceNumber, status.
# Ah! In the fetch response we do:
# const result = await res.json();
# const extractedReference = result.referenceNumber || result.data?.referenceNumber || ...
# setSuccessData({ ...record, referenceNumber: extractedReference, status: 'SUBMITTED' });

# I need to see how setSuccessData is called in InstitutionRegistrationForm
