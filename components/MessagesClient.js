"use client"

import { useState, useEffect } from "react"
import UserList from "@/components/messages/UserList"

export default function MessagesClient({
  users = [],
  conversations = [],
  currentUser,
  fromContact = false,
  conversationId,
}) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(fromContact)

  useEffect(() => {
    if (fromContact) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [fromContact])

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Messages</h1>
            <p className="text-neutral-600">Connect with other users in our community</p>

            {showSuccessMessage && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-700 font-medium">Your message has been sent successfully!</p>
                </div>
                <p className="text-green-600 text-sm mt-1">We'll respond to your inquiry as soon as possible.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Start a Conversation</h2>
                <UserList users={users} currentUserId={currentUser?.id} />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-6">
                {conversations && conversations.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>
                    <div className="space-y-4">
                      {conversations.map((conversation) => (
                        <a
                          key={conversation.id}
                          href={`/messages/${conversation.otherUser.id}`}
                          className={`block p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors ${
                            conversationId === conversation.otherUser.id ? "bg-blue-50 border-blue-200" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-neutral-900">{conversation.otherUser.name}</h3>
                              <p className="text-sm text-neutral-600 truncate max-w-md">
                                {conversation.fromUserId === currentUser.id ? "You: " : ""}
                                {conversation.content}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-neutral-500">
                                {new Date(conversation.createdAt).toLocaleDateString()}
                              </p>
                              {!conversation.read && conversation.toUserId === currentUser.id && (
                                <div className="w-2 h-2 bg-primary-600 rounded-full mt-1 ml-auto"></div>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-700 mb-2">No conversations yet</h3>
                    <p className="text-neutral-500">Select a user from the list to start your first conversation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
