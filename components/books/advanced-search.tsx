"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useBooksStore } from "@/lib/store"
import { Search, Filter, Save, History, X, Star } from "lucide-react"

export function AdvancedSearch() {
  const {
    searchQuery,
    selectedCategory,
    selectedCondition,
    priceRange,
    sortBy,
    searchHistory,
    savedSearches,
    setSearchQuery,
    setSelectedCategory,
    setSelectedCondition,
    setPriceRange,
    setSortBy,
    clearSearchHistory,
    removeFromSearchHistory,
    saveSearch,
    deleteSavedSearch,
    applySavedSearch,
  } = useBooksStore()

  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [searchName, setSearchName] = useState("")

  const categories = ["all", "Fiction", "Non-Fiction", "Textbook", "Biography", "Science", "History", "Romance"]
  const conditions = ["all", "Excellent", "Good", "Fair", "Poor"]
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "title", label: "Title A-Z" },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(localSearch)
  }

  const handleSaveSearch = () => {
    const searchParams = {
      name: searchName || `Search: ${localSearch || "All books"}`,
      query: localSearch,
      category: selectedCategory,
      condition: selectedCondition,
      priceRange: priceRange,
    }
    saveSearch(searchParams)
    setSearchName("")
    setShowSaveDialog(false)
  }

  const clearAllFilters = () => {
    setLocalSearch("")
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedCondition("all")
    setPriceRange([0, 100])
    setSortBy("newest")
  }

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedCondition !== "all" || sortBy !== "newest"

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by title, author, ISBN, or description..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
        <Button type="button" variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
          <Filter className="h-4 w-4 mr-2" />
          Advanced
        </Button>
      </form>

      {/* Search History & Suggestions */}
      {(searchHistory.length > 0 || localSearch === "") && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Recent Searches</span>
              </div>
              {searchHistory.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearSearchHistory}>
                  Clear All
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent searches</p>
              ) : (
                searchHistory.map((query, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 gap-1"
                    onClick={() => {
                      setLocalSearch(query)
                      setSearchQuery(query)
                    }}
                  >
                    {query}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFromSearchHistory(query)
                      }}
                    />
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Saved Searches</span>
            </div>
            <div className="space-y-2">
              {savedSearches.map((savedSearch) => (
                <div key={savedSearch.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{savedSearch.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {savedSearch.query && `"${savedSearch.query}"`}
                      {savedSearch.category !== "all" && ` • ${savedSearch.category}`}
                      {savedSearch.condition !== "all" && ` • ${savedSearch.condition}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => applySavedSearch(savedSearch)}>
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteSavedSearch(savedSearch.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Advanced Filters</CardTitle>
                <CardDescription>Refine your search with detailed criteria</CardDescription>
              </div>
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Search
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Search</DialogTitle>
                    <DialogDescription>Give your search a name to save it for later use.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="searchName">Search Name</Label>
                      <Input
                        id="searchName"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="e.g., Fiction under $20"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Current filters:</p>
                      <ul className="list-disc list-inside mt-1">
                        {localSearch && <li>Search: "{localSearch}"</li>}
                        {selectedCategory !== "all" && <li>Category: {selectedCategory}</li>}
                        {selectedCondition !== "all" && <li>Condition: {selectedCondition}</li>}
                        <li>
                          Price: ${priceRange[0]} - ${priceRange[1]}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveSearch}>Save Search</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Condition Filter */}
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition === "all" ? "All Conditions" : condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </Label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={100} min={0} step={5} className="w-full" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
