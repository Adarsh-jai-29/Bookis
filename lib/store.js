import { create } from "zustand"
import { persist } from "zustand/middleware"

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false, // true for testing purposes
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
  books: [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 15.99,
      condition: "Good",
      description: "Classic American literature in good condition",
      image: "/great-gatsby-book-cover.png",
      sellerId: 1,
      sellerName: "John Doe",
      category: "Fiction",
      isbn: "978-0-7432-7356-5",
      publishedYear: 1925,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 12.5,
      condition: "Excellent",
      description: "Pulitzer Prize winning novel in excellent condition",
      image: "/to-kill-a-mockingbird-cover.png",
      sellerId: 2,
      sellerName: "Jane Smith",
      category: "Fiction",
      isbn: "978-0-06-112008-4",
      publishedYear: 1960,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 18.0,
      condition: "Fair",
      description: "Dystopian classic with some wear but readable",
      image: "/1984-book-cover.png",
      sellerId: 1,
      sellerName: "John Doe",
      category: "Fiction",
      isbn: "978-0-452-28423-4",
      publishedYear: 1949,
      createdAt: new Date().toISOString(),
    },
  ],
  searchQuery: "",
  selectedCategory: "all",
  selectedCondition: "all",
  priceRange: [0, 100],
  sortBy: "newest",
  searchHistory: [],
  savedSearches: [],
  addBook: (book) =>
    set((state) => ({
      books: [...book],
    })),
  
    
  updateBook: (id, updates) =>
    set((state) => ({
      books: state.books.map((book) => (book.id === id ? { ...book, ...updates } : book)),
    })),
  deleteBook: (id) =>
    set((state) => ({
      books: state.books.filter((book) => book.id !== id),
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
  conversations: [
    {
      id: "1-2-1",
      buyerId: 2,
      sellerId: 1,
      bookId: 1,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      lastMessage: null,
    },
  ],
  activeConversation: null,
  messages: {
    "1-2-1": [
      {
        id: 1,
        senderId: 2,
        content: "Hi! I'm interested in your copy of The Great Gatsby. Is it still available?",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: true,
      },
      {
        id: 2,
        senderId: 1,
        content: "Yes, it's still available! It's in good condition with minimal wear.",
        timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
        read: true,
      },
      {
        id: 3,
        senderId: 2,
        content: "Great! Could you tell me more about the condition? Any highlighting or notes?",
        timestamp: new Date(Date.now() - 2400000).toISOString(), // 40 minutes ago
        read: false,
      },
    ],
  },
  createConversation: (buyerId, sellerId, bookId) => {
    const conversationId = `${buyerId}-${sellerId}-${bookId}`
    const existingConversation = get().conversations.find((c) => c.id === conversationId)

    if (existingConversation) {
      return conversationId
    }

    const conversation = {
      id: conversationId,
      buyerId,
      sellerId,
      bookId,
      createdAt: new Date().toISOString(),
      lastMessage: null,
    }
    set((state) => ({
      conversations: [...state.conversations, conversation],
      messages: { ...state.messages, [conversationId]: [] },
    }))
    return conversationId
  },
  setActiveConversation: (conversationId) => set({ activeConversation: conversationId }),
  sendMessage: (conversationId, senderId, content) => {
    const message = {
      id: Date.now(),
      senderId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    }
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, lastMessage: message } : conv,
      ),
    }))
  },
  getConversationMessages: (conversationId) => {
    return get().messages[conversationId] || []
  },
  markMessagesAsRead: (conversationId, userId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]:
          state.messages[conversationId]?.map((msg) => (msg.senderId !== userId ? { ...msg, read: true } : msg)) || [],
      },
    }))
  },
}))

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
