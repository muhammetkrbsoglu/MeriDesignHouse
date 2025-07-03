"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function MessageManagement({ messages: initialMessages = [], stats = {} }) {
  const [messages, setMessages] = useState(initialMessages)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("all") // all, unread, read

  useEffect(() => {
    // If no initial messages provided, fetch them
    if (initialMessages.length === 0) {
      fetchMessages()
    }
  }, [initialMessages.length])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/messages")
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      })

      if (response.ok) {
        setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)))
      }
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  const filteredMessages = messages.filter((message) => {
    if (filter === "unread") return !message.read
    if (filter === "read") return message.read
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Message Management</h1>
          <p className="text-gray-600">View and manage all user messages</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "all", label: "All Messages", count: messages.length },
                { key: "unread", label: "Unread", count: messages.filter((m) => !m.read).length },
                { key: "read", label: "Read", count: messages.filter((m) => m.read).length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? "border-pink-500 text-pink-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {filteredMessages.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${!message.read ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {message.sender.name?.charAt(0).toUpperCase() ||
                            message.sender.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{message.sender.name || "Anonymous User"}</h3>
                          <p className="text-sm text-gray-500">{message.sender.email}</p>
                        </div>
                        {!message.read && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>

                      <div className="mb-3">
                        <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">{message.content}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</p>

                        <div className="flex space-x-2">
                          <Link
                            href={`/messages?conversationId=${message.sender.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            Reply
                          </Link>

                          {!message.read && (
                            <button
                              onClick={() => markAsRead(message.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === "unread"
                  ? "No unread messages."
                  : filter === "read"
                    ? "No read messages."
                    : "No messages found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
