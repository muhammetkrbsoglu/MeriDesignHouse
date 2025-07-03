"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function MessageForm({ currentUserId, otherUserId }) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim() || loading) return

    setLoading(true)

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          receiverId: otherUserId,
        }),
      })

      if (response.ok) {
        setContent("")
        // Don't refresh the page to prevent unwanted scrolling
        // The message will appear when the page is refreshed manually or navigated back
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }

    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-4">
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          rows={3}
          maxLength={1000}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-neutral-500">{content.length}/1000</span>
          <span className="text-xs text-neutral-500">Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
      <div className="flex flex-col justify-end">
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </form>
  )
}
