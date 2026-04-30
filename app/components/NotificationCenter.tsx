"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, onSnapshot, doc, updateDoc } from "firebase/firestore";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "request" | "session" | "system";
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const { email } = JSON.parse(storedUser);

    const q = query(
      collection(db, "notifications"),
      where("userEmail", "==", email),
      limit(50) // Fetch a bit more to ensure we have recent ones after sorting
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      // Sort client-side to avoid requiring a composite index
      const sortedData = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 20); // Keep only top 20
      
      setNotifications(sortedData);
      setUnreadCount(sortedData.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const docRef = doc(db, "notifications", id);
      await updateDoc(docRef, { read: true });
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => markAsRead(n.id)));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors group"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined text-slate-600 group-hover:text-primary-600 transition-colors">
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-scale-in">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-slate-300">notifications_off</span>
                  </div>
                  <p className="text-xs text-slate-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.read ? "bg-primary-50/30" : ""}`}
                    onClick={() => {
                      if (!n.read) markAsRead(n.id);
                      if (n.link) window.location.href = n.link;
                    }}
                  >
                    {!n.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                    )}
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        n.type === "request" ? "bg-amber-100 text-amber-600" : 
                        n.type === "session" ? "bg-blue-100 text-blue-600" : 
                        "bg-slate-100 text-slate-600"
                      }`}>
                        <span className="material-symbols-outlined text-sm">
                          {n.type === "request" ? "swap_horiz" : n.type === "session" ? "videocam" : "info"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold text-slate-800 truncate ${!n.read ? "pr-2" : ""}`}>
                          {typeof n.title === "string" ? n.title : "New Notification"}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                          {typeof n.message === "string" ? n.message : ""}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                  View all activity
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
