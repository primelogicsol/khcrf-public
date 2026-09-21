# Master Artisans Audit Update

## Two Additional Aspects: Form Functionality and Submission Governance

The earlier audit should be updated with the following two sections.

---

# 12. End-to-End Form Functionality

The Master Artisans section contains four public forms:

1. **Nominate an Artisan**
2. **Submit a Story**
3. **Become a Contributor**
4. **Submit Historical Documentation**

All four routes load and display their expected fields on the production website. However, based on the live public interface alone, **none of the four forms can presently be certified as fully functional end to end**.

A form is not fully functional merely because:

* the page opens,
* the fields are visible,
* required-field asterisks appear,
* or a Submit button is present.

A production-grade form must successfully complete the entire submission pipeline:

> Client validation → file validation → payload creation → API request → controller processing → database write → file storage → confirmation response → administrative visibility → notification → later retrieval.

The public pages confirm the presentation layer, but they do not publicly demonstrate successful database creation, administrative receipt, confirmation email delivery, or record retrieval.

## Updated form status

| Form                     | Page loads | Fields visible | Client validation verifiable | API submission verified | Database write verified | Admin receipt verified | Overall status |
| ------------------------ | ---------: | -------------: | ---------------------------: | ----------------------: | ----------------------: | ---------------------: | -------------- |
| Nominate an Artisan      |        Yes |            Yes |                    Partially |            Not verified |            Not verified |           Not verified | **Unverified** |
| Submit a Story           |        Yes |            Yes |                    Partially |            Not verified |            Not verified |           Not verified | **Unverified** |
| Become a Contributor     |        Yes |            Yes |                    Partially |            Not verified |            Not verified |           Not verified | **Unverified** |
| Historical Documentation |        Yes |            Yes |                    Partially |            Not verified |            Not verified |           Not verified | **Unverified** |

The forms are publicly visible at their respective production routes. Their field structures and upload requirements are confirmed by the live site. ([Hamadan Craft Revival Foundation][1])

## Important audit conclusion

> **No Master Artisans form should presently be marked “PASS” or “fully functional” without a controlled submission test and verification inside the administration panel and database.**

The correct status is:

**UI PRESENT — END-TO-END FUNCTIONALITY NOT YET PROVEN**

---

## 12.1 Nominate an Artisan

The form requests:

* artisan name,
* craft category,
* years of practice,
* district, village, or mohalla,
* nomination explanation,
* optional workshop photograph,
* nominator name,
* email,
* phone,
* consent confirmation. ([Hamadan Craft Revival Foundation][1])

### What appears functional

* The route loads.
* Core nomination fields are displayed.
* Craft selection is available.
* A photograph upload field is present.
* Consent confirmation is included.
* The submission button is visible.

### What remains unverified

* Required fields actually block submission.
* Years of practice accepts only valid numeric values.
* Minimum 20-year eligibility is enforced technically.
* Email format validation works.
* Phone format validation works.
* Consent checkbox is mandatory.
* Unsupported image types are rejected.
* Files over 10 MB are rejected both client-side and server-side.
* The server validates MIME type rather than trusting the file extension.
* The API returns a meaningful success or error response.
* The nomination is written to the database.
* The uploaded photograph is stored correctly.
* A duplicate artisan nomination is detected.
* The nominator receives a confirmation.
* Administrators can view and review the nomination.
* Submission does not automatically publish an artisan profile.

### Specific functional test cases

| Test                            | Expected result                                |
| ------------------------------- | ---------------------------------------------- |
| Submit completely empty form    | Field-specific errors                          |
| Enter text in Years of Practice | Rejected                                       |
| Enter negative number           | Rejected                                       |
| Enter fewer than 20 years       | Eligibility warning or valid exception process |
| Invalid email                   | Rejected                                       |
| Invalid phone                   | Rejected                                       |
| Leave consent unchecked         | Submission blocked                             |
| Upload `.exe` renamed `.jpg`    | Server rejection                               |
| Upload image over 10 MB         | Rejected                                       |
| Submit same artisan twice       | Duplicate warning                              |
| Valid submission                | Unique reference number generated              |
| Valid submission in admin       | Appears in pending nominations                 |
| Accepted nomination             | Does not publish without review                |

### Current verdict

**Not certified as fully functional.**

---

## 12.2 Submit a Story or Manuscript

The live form requests:

* author name,
* email,
* story title,
* pitch or synopsis,
* optional manuscript or portfolio,
* optional notes. ([Hamadan Craft Revival Foundation][2])

### What appears functional

* The page loads.
* Required fields are identified.
* The synopsis field is present.
* Document upload is available.
* Accepted formats are displayed.
* A maximum file size is stated.

### What remains unverified

* The 300-word synopsis limit is actually enforced.
* Word counting handles punctuation and pasted text correctly.
* PDF, DOCX, DOC, JPEG, and PNG validation works.
* Unsupported formats are rejected server-side.
* Malicious document content is scanned.
* Uploaded files are stored and linked to the submission.
* The editorial team can retrieve the manuscript.
* The contributor receives an acknowledgement email.
* Duplicate story submissions are detected.
* The submission receives an editorial tracking number.
* Status changes can be communicated to the author.
* Draft material remains private.
* The form prevents unauthorised public file exposure.

### Missing publication declarations

Before submission, the form should require confirmation that:

* the work is original,
* the author owns or controls the rights,
* quoted material is properly attributed,
* photographed or interviewed people gave consent,
* no confidential information is being submitted,
* AI-assisted content has been disclosed where applicable,
* HCRF may review but is not obliged to publish the work.

### Current verdict

**Not certified as fully functional.**

---

## 12.3 Become a Contributor

The contributor form requests:

* full name,
* email,
* area of expertise,
* portfolio link,
* optional CV,
* motivation statement. ([Hamadan Craft Revival Foundation][3])

### What appears functional

* The page loads.
* Expertise options are displayed.
* Portfolio and CV fields are present.
* Motivation information is requested.

### Visible UI defect

The expertise choices appear compressed in the indexed production content:

> Photography Videography Translation (Kashmiri/English)Field Research

There is no clear separator between “Translation” and “Field Research.” ([Hamadan Craft Revival Foundation][3])

This may indicate:

* missing spacing,
* improperly associated labels,
* checkbox or radio layout problems,
* reduced accessibility,
* or incorrect semantic markup.

### What remains unverified

* Whether expertise options are selectable.
* Whether one or multiple expertise areas can be chosen.
* Whether an expertise selection is mandatory.
* Whether the selected values enter the payload.
* Whether malformed portfolio URLs are rejected.
* Whether CV file restrictions work server-side.
* Whether the motivation field has a meaningful minimum length.
* Whether duplicate applications are detected.
* Whether accepted applications create user accounts automatically.
* Whether administrators can change application status.
* Whether rejection and acceptance notifications work.
* Whether contributor permissions remain inactive until approval.

### Critical access rule

A contributor application must never automatically grant:

* archive upload privileges,
* editorial access,
* private-record access,
* artisan personal-data access,
* or publication authority.

The correct lifecycle is:

> Submitted → Identity Review → Expertise Review → Safeguarding Review → Approved → Agreement Accepted → Account Activated

### Current verdict

**Not certified as fully functional.**

---

## 12.4 Submit Historical Documentation

The form requests:

* document or artifact title,
* material type,
* historical context,
* approximate date,
* location,
* current owner or institution,
* copyright status,
* usage permission,
* uploaded media or document. ([Hamadan Craft Revival Foundation][4])

### What appears functional

* The route loads.
* Several material categories are available.
* Copyright information is requested.
* Usage permission choices are present.
* File upload is mandatory.

### What remains unverified

* A material type must be selected.
* Usage permission must be selected.
* Copyright status is validated.
* The uploaded file is saved.
* Large video and audio files fail gracefully.
* Invalid MIME types are rejected.
* Malware scanning is active.
* Records are quarantined before curator review.
* Restricted files are protected from public access.
* Research-only files cannot be accessed publicly.
* Owner and institution metadata are retained.
* Files receive checksums.
* Original filenames are sanitised.
* Duplicate archival files are detected.
* A deposit reference number is generated.
* Administrators can access the submission.
* The depositor receives acknowledgement.

### Major functional limitation

The public page states:

> “Images, Audio, Video, PDF (Max 10MB).” ([Hamadan Craft Revival Foundation][4])

This is not adequate for a serious archival deposit system.

A 10 MB limit makes many legitimate materials impossible to submit:

* high-resolution TIFF scans,
* lossless audio,
* long oral histories,
* documentary video,
* museum object photography,
* multi-page archival records.

### Current verdict

**Not suitable for full archival submission in its present visible configuration.**

---

# 13. Submission Governance, Security and Administrative Workflow

This is the second additional aspect.

A heritage archive does not merely collect ordinary contact data. These forms may receive:

* artisan identities,
* private family histories,
* workshop locations,
* photographs,
* unpublished manuscripts,
* oral histories,
* museum records,
* copyright-protected materials,
* culturally sensitive knowledge,
* rare design documents,
* personal phone numbers and email addresses.

Therefore, the forms require a stricter governance framework than an ordinary website enquiry form.

## 13.1 Privacy notices

Each form should display a form-specific privacy notice immediately before submission.

The notice should explain:

* who controls the submitted data,
* why it is being collected,
* how it will be reviewed,
* where it will be stored,
* how long it will be retained,
* who can access it,
* whether it may be published,
* whether it may be shared with researchers,
* how consent can be withdrawn,
* how corrections can be requested.

A generic footer privacy link is not enough for archival and artisan documentation submissions.

---

## 13.2 Consent granularity

Current consent language in the Artisan Nomination form broadly permits submission to an archive for public verification. ([Hamadan Craft Revival Foundation][1])

Consent should be separated into distinct permissions:

1. Permission to submit the information
2. Permission for HCRF to contact the artisan
3. Permission for internal verification
4. Permission to publish the artisan’s name
5. Permission to publish photographs
6. Permission to publish location details
7. Permission to use the material in research
8. Permission to use the material in exhibitions or publications

One checkbox should not silently cover all possible uses.

---

## 13.3 File-upload security

Every upload form should use server-side controls for:

* file size,
* extension,
* actual MIME type,
* file signature or magic bytes,
* malware scanning,
* filename sanitisation,
* path traversal prevention,
* executable-content rejection,
* PDF active-content detection,
* Office macro detection,
* image metadata handling,
* decompression-bomb protection,
* storage outside the public web root.

Client-side restrictions are useful for usability but are not security controls.

---

## 13.4 Anti-spam and abuse protection

The visible forms do not publicly demonstrate whether they use:

* CAPTCHA,
* a honeypot field,
* rate limiting,
* IP throttling,
* duplicate suppression,
* bot scoring,
* email verification,
* abuse monitoring.

These controls should be tested without making them hostile to legitimate rural or low-bandwidth users.

Recommended layered protection:

* invisible honeypot,
* per-IP and per-email rate limits,
* server-generated form token,
* duplicate content detection,
* malware scanning,
* moderation queue,
* CAPTCHA only when suspicious behaviour is detected.

---

## 13.5 Submission reference numbers

Every successful submission should return a unique reference number, for example:

* `MA-NOM-2026-000123`
* `MA-STORY-2026-000078`
* `MA-CONTRIB-2026-000041`
* `MA-DOC-2026-000216`

The confirmation page should display:

* reference number,
* submission date,
* form type,
* review status,
* next step,
* correction contact,
* expected review process.

It should not expose internal database identifiers.

---

## 13.6 Administrative workflow

Each form requires a dedicated administrative queue.

| Form                     | Recommended admin queue                 |
| ------------------------ | --------------------------------------- |
| Artisan nomination       | Pending Identity and Craft Verification |
| Story submission         | Pending Editorial Review                |
| Contributor application  | Pending Contributor Screening           |
| Historical documentation | Pending Accession and Rights Review     |

The administrator should be able to:

* open the full submission,
* preview attachments safely,
* assign a reviewer,
* add internal notes,
* request more information,
* detect duplicates,
* change status,
* record consent,
* record provenance,
* approve or reject,
* generate a public record only after approval,
* preserve an audit log.

---

## 13.7 Notifications

A complete form workflow should generate:

### User notification

* submission received,
* reference number,
* summary of submitted information,
* privacy and correction instructions,
* next stage.

### Internal notification

* form type,
* reference number,
* submission timestamp,
* risk flags,
* attachment details,
* assigned queue.

Email failure should not roll back a valid database submission. Notification status should be logged separately.

---

## 13.8 Error handling

Every form must provide field-specific errors.

Bad example:

> Validation failed.

Required example:

> Workshop photograph exceeds the 10 MB limit.

Or:

> Please select an area of expertise.

Or:

> The manuscript file type is not supported. Upload PDF, DOC, DOCX, JPEG, or PNG.

The user’s entered data should remain in the form after an error, except for files that browsers cannot safely retain.

---

## 13.9 Accessibility

All form controls should be tested for:

* visible labels,
* programmatic label association,
* keyboard navigation,
* logical tab order,
* screen-reader error announcement,
* focus movement to the first invalid field,
* sufficient colour contrast,
* clear required-field indication,
* non-colour error indicators,
* accessible file-upload instructions.

The compressed contributor expertise text raises a particular concern about labels and option grouping. ([Hamadan Craft Revival Foundation][3])

---

# Revised Master Artisans Score

| Area                                   |        Previous score | Revised score |
| -------------------------------------- | --------------------: | ------------: |
| Information architecture               |                  9/10 |          9/10 |
| Navigation availability                |                  8/10 |          8/10 |
| Content depth                          |                  8/10 |          8/10 |
| Data credibility                       |                  4/10 |          4/10 |
| General functionality                  |                  4/10 |          4/10 |
| **Form functionality**                 | Not separately scored |      **3/10** |
| **Submission governance and security** | Not separately scored |      **3/10** |
| Editorial readiness                    |                  4/10 |          4/10 |
| Archive integrity                      |                  4/10 |          4/10 |
| SEO and metadata                       |                  4/10 |          4/10 |
| Overall production readiness           |                5.5/10 |      **5/10** |

---

# Mandatory End-to-End Acceptance Test

The development team should not report any Master Artisans form as complete until the following sequence passes for each form:

1. Open the production form.
2. Attempt empty submission.
3. Verify every required-field error.
4. Test invalid data formats.
5. Test minimum and maximum lengths.
6. Test all select, checkbox and radio values.
7. Test an allowed file.
8. Test an oversized file.
9. Test a false-extension file.
10. Submit a valid controlled test record.
11. Confirm a 2xx API response.
12. Confirm a database record is created.
13. Confirm uploaded media is stored.
14. Confirm private files are not publicly accessible.
15. Confirm the record appears in the correct admin queue.
16. Confirm administrators can open the full record.
17. Confirm the applicant receives acknowledgement.
18. Confirm administrators receive notification.
19. Confirm duplicate submission behaviour.
20. Confirm approval does not automatically publish private information.
21. Delete or archive the controlled test record.
22. Confirm the audit log records the full lifecycle.

---

# Updated Final Verdict

The four Master Artisans forms **exist visually**, but their full operational status remains unproven.

The accurate institutional statement is:

> **The Master Artisans participation forms are publicly available, but they should remain under technical verification until successful API submission, database persistence, attachment storage, administrative retrieval, notification delivery, moderation and security controls have been demonstrated.**

The forms must not be labelled fully functional merely because they display correctly.

The next release should treat these four forms as a single priority workstream:

> **Nominate an Artisan → Submit a Story → Become a Contributor → Submit Historical Documentation**

Each must be tested from the first user keystroke to the final administrative decision.

[1]: https://khcrf.org/master-artisans/nominate?utm_source=chatgpt.com "Hamadan Craft Revival Foundation"
[2]: https://khcrf.org/master-artisans/submit-story?utm_source=chatgpt.com "Hamadan Craft Revival Foundation"
[3]: https://khcrf.org/master-artisans/contributor?utm_source=chatgpt.com "Hamadan Craft Revival Foundation"
[4]: https://khcrf.org/master-artisans/support?utm_source=chatgpt.com "Hamadan Craft Revival Foundation"
