import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BookOpen, 
  BookType, 
  FileText, 
  Filter,
  SortAsc,
  SortDesc,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Book {
  id: number;
  name: string;
  author: string;
  year: number;
  type: 'physical' | 'file';
  file_path?: string;
  available: boolean;
}

interface BooksProps {
  books: Book[];
}

export default function Books({ books }: BooksProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Books',
      href: route('student.books'),
    },
  ];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading] = useState(false);

  // Filter and sort books
  const filteredBooks = books.filter(book => {
    // Apply search filter
    const matchesSearch = 
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply type filter
    const matchesType = 
      typeFilter === 'all' || 
      book.type === typeFilter;

    return matchesSearch && matchesType;
  }).sort((a, b) => {
    // Apply sorting
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'author') {
      return sortOrder === 'asc' 
        ? a.author.localeCompare(b.author) 
        : b.author.localeCompare(a.author);
    } else if (sortBy === 'year') {
      return sortOrder === 'asc' 
        ? a.year - b.year 
        : b.year - a.year;
    }
    return 0;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Browse Books" />
      
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-8">Browse Books</h1>
        
        {/* Search and filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by title or author..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <div className="w-40">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="file">Digital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-40">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SortAsc className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Title</SelectItem>
                      <SelectItem value="author">Author</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Books grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">{book.name}</h3>
                        <p className="text-gray-500">{book.author}</p>
                      </div>
                      <Badge className={book.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {book.available ? "Available" : "Borrowed"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mt-4">
                      <div className="flex items-center mr-4">
                        {book.type === 'physical' ? (
                          <BookOpen className="h-4 w-4 mr-1 text-blue-500" />
                        ) : (
                          <FileText className="h-4 w-4 mr-1 text-purple-500" />
                        )}
                        <span>{book.type === 'physical' ? 'Physical' : 'Digital'}</span>
                      </div>
                      <div>
                        <BookType className="h-4 w-4 mr-1 inline" />
                        <span>{book.year}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t p-4 bg-gray-50 flex justify-center">
                    <Link href={route('student.books.show', book.id)}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium">No books found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
