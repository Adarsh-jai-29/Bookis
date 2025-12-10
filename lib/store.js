
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createOrGetConversation, fetchMessages, markRead, fetchConversations } from "../app/services/chatService"


// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false, 
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (userData) => set({ user: { ...get().user, ...userData } }),
    }),
    {
      name: "bookish-auth",
    },
  ),
)


// Books Store
export const useBooksStore = create((set, get) => ({
  books: [],
  searchQuery: "",
  selectedCategory: "all",
  selectedCondition: "all",
  priceRange: [0, 100],
  sortBy: "newest",
  searchHistory: [],
  savedSearches: [],
 
  fetchBooks: async () => {
    try {
      const res = await fetch("/api/books")
      const data = await res.json()
      console.log(data)
      if (!res.ok) throw new Error(data?.message || "Failed to fetch books")
        set({ books: [data] || data || [] })
      return data
    } catch (err) {
      console.error("fetchBooks error:", err)
      set({ books: [] })
    }
  },

  addBook: (book) =>
    set(() => ({
      books: [...book],
    })),
  
    
  updateBook: (id, updates) =>
    set((state) => ({
      books: state.books.map((book) => (book._id === id ? { ...book, ...updates } : book)),
    })),
  deleteBook: (id) =>
    set((state) => ({
      books: state.books.filter((book) => book._id !== id),
    })),
  setSearchQuery: (query) => {
    set((state) => {
      const newHistory = query.trim()
        ? [query, ...state.searchHistory.filter((h) => h !== query)].slice(0, 10)
        : state.searchHistory
      return { searchQuery: query, searchHistory: newHistory }
    })
  },
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedCondition: (condition) => set({ selectedCondition: condition }),
  setPriceRange: (range) => set({ priceRange: range }),
  setSortBy: (sortBy) => set({ sortBy: sortBy }),
  clearSearchHistory: () => set({ searchHistory: [] }),
  removeFromSearchHistory: (query) =>
    set((state) => ({ searchHistory: state.searchHistory.filter((h) => h !== query) })),
  saveSearch: (searchParams) => {
    const searchId = Date.now().toString()
    const savedSearch = {
      id: searchId,
      name: searchParams.name || `Search ${searchId}`,
      query: searchParams.query || "",
      category: searchParams.category || "all",
      condition: searchParams.condition || "all",
      priceRange: searchParams.priceRange || [0, 100],
      createdAt: new Date().toISOString(),
    }
    set((state) => ({
      savedSearches: [...state.savedSearches, savedSearch],
    }))
  },
  deleteSavedSearch: (id) =>
    set((state) => ({
      savedSearches: state.savedSearches.filter((s) => s.id !== id),
    })),
  applySavedSearch: (savedSearch) =>
    set({
      searchQuery: savedSearch.query,
      selectedCategory: savedSearch.category,
      selectedCondition: savedSearch.condition,
      priceRange: savedSearch.priceRange,
    }),
  getFilteredBooks: () => {
    const { books, searchQuery, selectedCategory, selectedCondition, priceRange, sortBy } = get()
    const filtered = books.filter((book) => {
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || book.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchesCondition =
        selectedCondition === "all" || book.condition.toLowerCase() === selectedCondition.toLowerCase()
      const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesCondition && matchesPrice
    })

    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return filtered
  },
}))

// Chat Store
export const useChatStore = create((set, get) => ({
  conversations: [],
  messages: {},        // { conversationId: [msgs...] }
  activeConversation: null,
  socket: null,        // set externally after socket created

  // load conversation list for user
  loadConversations: async (userId) => {
    try {
      const data = await fetchConversations(userId)
      // API may return { conversations: [...] } or an array; normalize
      const convs = data.conversations || data || []
      set({ conversations: convs })
    } catch (err) {
      console.error("loadConversations error:", err)
      set({ conversations: [] })
    }
  },

  openConversation: async ({ buyerId, sellerId, bookId, userId }) => {
    try {
      // create or get conversation
      const data = await createOrGetConversation(buyerId, sellerId, bookId)
      const conversation = data.conversation || data
      const conversationId = conversation?._id || conversation?.id
      if (!conversationId) throw new Error("Invalid conversation returned from server")
      // console.log(conversation)
      // fetch first page of messages via helper (safe)
      const msgsJson = await fetchMessages(conversationId, 1, 30)
      const msgs = msgsJson.messages || msgsJson || []
      
      set((state) => ({
        activeConversation: conversationId,
        messages: { ...state.messages, [conversationId]: msgs },
        // merge conversation into list (avoid duplicates)
        conversations: (() => {
          const exists = state.conversations.some((c) => String(c._id || c.id) === String(conversationId))
          return exists ? state.conversations.map((c) => (String(c._id || c.id) === String(conversationId) ? { ...(c || {}), ...conversation } : c)) : [...state.conversations, conversation]
        })(),
      }))
   

      // mark read via API (safe)
      await markRead(conversationId, userId).catch((e) => console.warn("markRead failed:", e))

      // // emit socket read event if socket attached
      const s = get().socket
      if (s?.connected) s.emit("message:read", { conversationId, userId })

      return conversationId
    } catch (err) {
      console.error("openConversation error:", err)
      return null
    }
  },

 fetchConversationMessages: async (conversationId, page = 1, limit = 30) => {
  console.log(get())
      try {
        const data = await fetchMessages(conversationId, page, limit)
        const msgs = data.messages || data || []
        // console.log(state)
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: page === 1 ? msgs : [...(state.messages[conversationId] || []), ...msgs],
          }
          
        }))
      } catch (err) {
        console.error("fetchConversationMessages error:", err)
      }
    },

  sendMessageViaSocket: (payload) => {
    // console.log('last')
    // optimistic UI push
    const { conversationId, senderId, content } = payload;
    const tmpId = `tmp-${Date.now()}`;
    const tmpMsg = { _id: tmpId, conversationId, senderId, content, read: false, createdAt: new Date().toISOString() };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), tmpMsg],
      },
      conversations: state.conversations.map((c) =>
        c._id === conversationId ? { ...c, lastMessage: tmpMsg } : c
      ),
    }));
  },

  attachSocket: (socket) => {
    // called once from component where socket is available
    set({ socket });
    socket.on("message:received", ({ message, conversationId }) => {
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), message],
        },
        conversations: state.conversations.map((c) =>
          String(c._id) === String(conversationId) ? { ...c, lastMessage: message } : c
        ),
      }));
    });

      socket.on("message:read", ({ conversationId, by }) => {
        // mark messages as read locally where senderId !== by
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: (state.messages[conversationId] || []).map((m) =>
              m.senderId !== by ? { ...m, read: true } : m
            ),
          },
        }));
      });
    },
  }));


  // Orders Store
  export const useOrdersStore = create((set, get) => ({
    orders: [
      // Mock orders for demo
      {
        id: "ORD-001",
        bookId: 1,
        buyerId: 2,
        sellerId: 1,
        status: "pending",
        totalAmount: 15.99,
        shippingAddress: {
          name: "Jane Smith",
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        paymentMethod: "credit_card",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days from now
      },
    ],
    createOrder: (orderData) => {
      const order = {
        id: `ORD-${Date.now()}`,
        ...orderData,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 86400000).toISOString(),
      }
      set((state) => ({
        orders: [...state.orders, order],
      }))
      return order.id
    },
    updateOrderStatus: (orderId, status) => {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order,
        ),
      }))
    },
    getOrdersByUser: (userId, type = "all") => {
      const { orders } = get()
      return orders.filter((order) => {
        if (type === "buyer") return order.buyerId === userId
        if (type === "seller") return order.sellerId === userId
        return order.buyerId === userId || order.sellerId === userId
      })
    },
    getOrderById: (orderId) => {
      const { orders } = get()
      return orders.find((order) => order.id === orderId)
    },
  }))

  // UI Store
  export const useUIStore = create((set) => ({
    theme: "dark",
    sidebarOpen: false,
    toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
  }))




