# KHCRF Publication Module Complete Architecture Audit

## Executive Summary
This audit confirms your suspicion with **100% certainty**: there are **two duplicate, conflicting manuscript architectures coexisting** within the application. The system attempts to dynamically bridge an old "flat" `blocks/content` structure with a new hierarchical `pages[].content` structure on the fly during hydration, but the editor state and the save handlers are misaligned. This dual-architecture conflict is the root cause of the "changing chapter counts," silent failures, and stale state closures.

---

## 1. PublicationForm.tsx Architecture

### State Variables & Sources of Truth
- **`formData`**: Stores top-level metadata (Title, Author, Blueprint). This works correctly and is synced well.
- **`chapters`**: Stores the manuscript hierarchy.
  - **Structure**: `Chapter` -> `pages: Page[]` -> `content: string` (which is stringified JSON blocks).
  - **Local UI state**: `activeChapterIdx` and `activeSubIdx`.

### The Break in State
The Manuscript Builder operates entirely by reading and mutating `chapters[activeChapterIdx].pages[0].content`.
When typing, `editBlock()` parses the string, modifies the array, stringifies it, and calls `setChapters()`.
However, because hydration is loosely typed, `chapters[activeChapterIdx]` can easily point to a phantom chapter created by the duplicate ID bug (explained below), meaning you are typing into a "ghost" chapter while `Save Draft` saves a different chapter array.

---

## 2. Manuscript Builder Conflict

### Where Content is Stored
Content is currently stored in two completely different shapes:
- **Shape A (Legacy/Flat)**: `chapter.content` or `chapter.blocks[]`
- **Shape B (New/Nested)**: `chapter.pages[0].content`

### The Duplication Bug
In `add/page.tsx`, the `handleSubmit` loop looks like this:
```typescript
let chapterId = chapter.id;
if (isDbId(chapter.id)) {
  await api.put(`/publications/chapters/${chapterId}`, ...);
} else {
  const res = await api.post("/publications/chapters", ...);
  chapterId = res.data.id;
}
```
**CRITICAL FLAW**: When a chapter is `POST`ed, the frontend `chapters` state is **never updated with the new database ID**. 
When you click "Save Draft" a second time, `isDbId(chapter.id)` is STILL FALSE for that same chapter, so it sends ANOTHER `POST` request, creating a duplicate chapter in the database.
When you press F5, hydration loads BOTH chapters. This is why you saw `chapters: 1` jump to `chapters: 2` and then `chapters: 3`. 

---

## 3. Save Draft Conflict

### All Handlers
There are two completely disconnected "Save Draft" execution flows:
1. **The Test Button (`runSavePersistenceTest`)**: Manually fabricates a completely valid Chapter array from scratch and hardcodes the `pages` array: `pages: [{ content: JSON.stringify(...) }]`. This forces the backend to use the new architecture properly, which is why it always passes.
2. **The Real Buttons (`handleSaveDraft`)**: Relies on the `chapters` React state. But because of the duplicate chapter ID bug and the flat vs. nested mismatch, the `chapters` state either contains ghost chapters, or `activeChapterIdx` points to a chapter that is disconnected from the ID the backend expects.

---

## 4. Chapter Models (The Coexisting Architectures)

### Model A: The Database / Flat Model
```typescript
{
  id: string;
  title: string;
  order: number;
  content?: string;  // Sometimes populated directly!
  blocks?: any[];    // Extracted in some hydration loops
}
```

### Model B: The Form / Nested Model
```typescript
{
  id: string;
  title: string;
  order: number;
  pages: [
    {
      id: string;
      content: string; // Stringified blocks!
      pageNumber: number;
    }
  ]
}
```

### The Hydration "Glue"
In `add/page.tsx` (`normalizeChaptersForUI`), there is literal code attempting to glue these together:
```typescript
if (ch.pages && ch.pages.length > 0) {
  // Use new pages model
} else if (ch.content || ch.blocks) {
  // Fallback for flat structure
  finalPages = [{
    content: ch.content || JSON.stringify(ch.blocks),
    pageNumber: 1,
  }];
}
```
Because this glue exists, the backend and frontend constantly transform the data back and forth, losing track of `page.id` along the way, which causes `PUT /publications/pages/:id` to either fail or update the wrong record.

---

## 5. Global Search References
- **`chapter.pages`**: Used heavily in `PublicationForm.tsx` and `test_save` validations.
- **`chapter.blocks`**: Used in `BulkClassificationModal`, `ManuscriptImportModal`, and legacy extraction logic.
- **`content`**: Used interchangeably as a string (HTML), a JSON array string, and an object array.

---

## 6. Dependency Graph & The Breakpoint
1. **Editor**: Edits `chapters[activeChapterIdx].pages[0].content`.
2. **State**: Updates locally, but creates "ghost" state if `page.id` is missing.
3. **Payload**: `handleSubmit` checks `isDbId(chapter.id)`. Since it's missing or stale, it creates duplicates.
4. **API**: `PUT /pages/:id` is attempted. **THE BREAKPOINT**: If it fails with 500 (due to malformed JSON or missing IDs), the try/catch block historically **swallowed** the error and showed "Draft Saved ✓".
5. **Database**: Remains untouched (or duplicates are inserted).
6. **Hydration**: Reloads the old untouched DB state + newly duplicated ghost chapters.

---

## 7. Conclusion: Are there old and new architectures coexisting?
**YES.**

### Conflicting Files
1. **`frontend/src/app/dashboard/business/publications/add/page.tsx`** (Hydration glue creates ghost state, Save handler loses new IDs, swallows 500 errors).
2. **`frontend/src/components/dashboard/publications/PublicationForm.tsx`** (Editor binds to `activeChapterIdx` without verifying DB IDs).
3. **`backend/src/controllers/publicationContentController.ts`** (`updatePage` crashes when it receives unexpected content shapes, but frontend hides the crash).

### Next Steps Recommendation
Do not patch any more buttons. The entire `Chapter` structure must be unified. We must decide NOW:
1. **Option A**: Delete `BookPage` entirely and store blocks directly on `Chapter.content`. (Simpler, flat).
2. **Option B**: Strictly enforce `BookPage` and delete all legacy `ch.blocks` and `ch.content` fallbacks.

Please advise which architecture (Flat or Nested) should be the single source of truth.
