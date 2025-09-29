"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBooksStore } from "@/lib/store"
import { Search, Filter, X } from "lucide-react"

export function BookFilters() {
  const {
    searchQuery,
    selectedCategory,
    priceRange,
    setSearchQuery,
    setSelectedCategory,
    setPriceRange,
    getFilteredBooks,
  } = useBooksStore()

  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["all", "Fiction", "Non-Fiction", "Textbook", "Biography", "Science", "History", "Romance"]
  const conditions = ["all", "Excellent", "Good", "Fair", "Poor"]
  const [selectedCondition, setSelectedCondition] = useState("all")

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(localSearch)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setLocalSearch("")
    setSelectedCategory("all")
    setSelectedCondition("all")
    setPriceRange([0, 100])
  }

  const filteredBooks = getFilteredBooks()
  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedCondition !== "all"

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by title, author, ISBN..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
        <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </form>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {selectedCategory}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
            </Badge>
          )}
          {selectedCondition !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Condition: {selectedCondition}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCondition("all")} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Books</CardTitle>
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

              {/* Price Range */}
              <div className="space-y-2">
                <Label>
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found
        </p>
        <Select defaultValue="newest">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
