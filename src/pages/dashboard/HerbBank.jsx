import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { getPlants } from "../../services/plant.service"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select"
import { Search, Filter, BookOpen, Loader2 } from "lucide-react"

export default function HerbBank() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: plants, isLoading, error } = useQuery({
    queryKey: ["plants", debouncedSearch, category],
    queryFn: () => getPlants({ search: debouncedSearch, category })
  })

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Herb Bank</h1>
          <p className="text-muted-foreground text-lg">The world's largest genomic and evidence-based database.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
          <Button>Explore Global Map</Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, symptom, or active compound..." 
            className="pl-9 h-11 w-full rounded-full" 
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 rounded-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="adaptogens">Adaptogens</SelectItem>
              <SelectItem value="anti-inflammatory">Anti-inflammatory</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : error ? (
        <div className="text-destructive font-semibold">Failed to load plant database.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plants?.map((plant) => (
             <Card onClick={() => navigate(`/herb/${plant.id}`)} key={plant.id} className="group overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
              <div className="aspect-[4/3] w-full bg-muted/50 p-6 flex flex-col justify-between relative">
                {(plant.imageUrl || plant.image) && <img src={plant.imageUrl || plant.image} alt={plant.name} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50" />}
                <div className="flex justify-between items-start z-10 relative">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm shadow-sm">{plant.category || plant.region || "Herb"}</Badge>
                </div>
                <BookOpen className="h-10 w-10 text-primary opacity-30 group-hover:opacity-100 transition-opacity z-10 relative" />
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">{plant.name}</CardTitle>
                <p className="text-xs italic text-muted-foreground">{plant.scientificName}</p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-foreground/80 line-clamp-2">{plant.description}</p>
                {plant.activeCompounds && (
                   <div className="mt-3 text-xs font-medium text-muted-foreground">Compounds: {Array.isArray(plant.activeCompounds) ? plant.activeCompounds.join(', ') : plant.activeCompounds}</div>
                )}
              </CardContent>
            </Card>
          ))}
          {plants?.length === 0 && (
             <div className="col-span-full text-center py-20 text-muted-foreground">No herbs found in database.</div>
          )}
        </div>
      )}
    </div>
  )
}
