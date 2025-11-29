/**
 * Helper: safely parse JSON from a Response without throwing on empty body.
 * Returns parsed object, {} when body empty, or { raw: string } when invalid JSON.
 */
async function safeJson(res) {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch (err) {
    // fallback: return raw text so callers can decide
    return { raw: text }
  }
}

export async function createOrGetConversation(buyerId, sellerId, bookId) {
  const res = await fetch("/api/conversations", {
    method: "POST",
    body: JSON.stringify({ buyerId, sellerId, bookId }),
    headers: { "Content-Type": "application/json" },
  })
  const data = await safeJson(res)
  if (!res.ok) {
    // throw with helpful message when available
    const msg = data?.message || data?.error || res.statusText || "Failed to create/get conversation"
    throw new Error(msg)
  }
  return data
}

export async function fetchMessages(conversationId, page = 1, limit = 30) {
  const res = await fetch(`/api/messages/${conversationId}?page=${page}&limit=${limit}`)
  const data = await safeJson(res)
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText || "Failed to fetch messages"
    throw new Error(msg)
  }
  return data
}

export async function markRead(conversationId, userId) {
  const res = await fetch(`/api/messages/mark-read`, {
    method: "PATCH",
    body: JSON.stringify({ conversationId, userId }),
    headers: { "Content-Type": "application/json" },
  })
  const data = await safeJson(res)
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText || "Failed to mark read"
    throw new Error(msg)
  }
  return data
}

// helper to load conversation list (safe parsing)
export async function fetchConversations(userId) {
  const res = await fetch(`/api/conversations?userId=${userId}`)
  const data = await safeJson(res)
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText || "Failed to load conversations"
    throw new Error(msg)
  }
  return data
}
