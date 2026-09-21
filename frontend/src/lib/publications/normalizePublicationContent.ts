export const normalizeParagraphContent = (content: unknown): string[] => {
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          return String((item as { text?: unknown }).text || "");
        }
        return "";
      })
      .filter(Boolean);
  }

  if (typeof content === "string") {
    return content
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (content && typeof content === "object") {
    const record = content as Record<string, unknown>;

    if (Array.isArray(record.paragraphs)) {
      return record.paragraphs
        .map((item) => String(item || "").trim())
        .filter(Boolean);
    }

    if (typeof record.text === "string") {
      return [record.text.trim()].filter(Boolean);
    }
  }

  return [];
};
