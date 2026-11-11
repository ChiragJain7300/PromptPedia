/**
 * PromptPedia Service Layer
 * Abstracts data access to support either direct NestJS API calls
 * or internal Next.js API route handlers.
 */

const getApiBase = () => {
  if (typeof window !== "undefined") {
    // Client-side: use proxy routes or explicit public API URL
    return process.env.NEXT_PUBLIC_API_URL || "/api";
  }
  return process.env.NEST_API_URL || process.env.NEXT_PUBLIC_API_URL || "/api";
};

export const fetchPrompts = async (searchParams = "") => {
  const base = getApiBase();
  const endpoint = base.endsWith("/api")
    ? `${base}/prompt${searchParams ? `?${searchParams}` : ""}`
    : `${base}/prompts${searchParams ? `?${searchParams}` : ""}`;

  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch prompts");
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
};

export const fetchPromptById = async (id) => {
  const base = getApiBase();
  const endpoint = base.endsWith("/api")
    ? `${base}/prompt/${id}`
    : `${base}/prompts/${id}`;

  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch prompt details");
  return res.json();
};

export const fetchUserPrompts = async (userId) => {
  const base = getApiBase();
  const endpoint = base.endsWith("/api")
    ? `${base}/users/${userId}/posts`
    : `${base}/prompts/user/${userId}`;

  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch user prompts");
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
};

export const createPrompt = async ({ prompt, content, tag, userId, creatorId, title }) => {
  const base = getApiBase();
  const endpoint = base.endsWith("/api")
    ? `${base}/prompt/new`
    : `${base}/prompts`;

  const payload = {
    title,
    content: content || prompt,
    prompt: prompt || content,
    tag,
    creatorId: creatorId || userId,
    userId: userId || creatorId,
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create prompt");
  return res.json();
};

export const updatePrompt = async (id, { prompt, content, tag, title }) => {
  const base = getApiBase();
  const endpoint = base.endsWith("/api")
    ? `${base}/prompt/${id}`
    : `${base}/prompts/${id}`;

  const payload = {
    title,
    content: content || prompt,
    prompt: prompt || content,
    tag,
  };

  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update prompt");
  return res.json();
};

export const deletePrompt = async (id) => {
  const base = getApiBase();
  const endpoint = base.endsWith("/api")
    ? `${base}/prompt/${id}`
    : `${base}/prompts/${id}`;

  const res = await fetch(endpoint, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete prompt");
  return true;
};

