import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Download, BookOpen, FileText, Calendar, BookMarked } from 'lucide-react';

interface Book {
  id: number;
  name: string;
  author: string;
  year: number;
  type: 'physical' | 'file';
  file_path?: string;
  available: boolean;
  created_at: string;
}

interface BookDetailsProps {
  book: Book;
  isAvailable: boolean;
  canDownload: boolean;
}

export default function BookDetails({ book, isAvailable, canDownload }: BookDetailsProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Books',
      href: route('student.books'),
    },
    {
      title: book.name,
      href: route('student.books.show', book.id),
    },
  ];
  
  const { post, processing } = useForm({
    book_id: book.id
  });

  const handleRequestLoan = () => {
    post(route('student.loans.request'), {
      onSuccess: () => {
        toast.success('Book loan request submitted. You can now pick up the book from the library.');
      },
      onError: (errors) => {
        toast.error(Object.values(errors)[0] as string);
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={book.name} />
      
      <div className="container py-6">
        <div className="mb-6">
          <Link href={route('student.books')} className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover/Icon Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="w-40 h-56 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                  {book.type === 'physical' ? (
                    <BookOpen className="h-20 w-20 text-gray-400" />
                  ) : (
                    <FileText className="h-20 w-20 text-gray-400" />
                  )}
                </div>
                <Badge className={`mb-2 ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isAvailable ? 'Available' : 'Currently Borrowed'}
                </Badge>
                <p className="text-sm text-gray-500">
                  {book.type === 'physical' ? 'Physical Book' : 'Digital Book'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Book Details Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{book.name}</CardTitle>
                <CardDescription>
                  <span className="text-base font-medium">{book.author}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Publication Year</p>
                      <p className="font-medium">{book.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookMarked className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Added to Library</p>
                      <p className="font-medium">{new Date(book.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Actions</h3>
                  
                  <div className="flex space-x-4">
                    {isAvailable && (
                      <Button onClick={handleRequestLoan} disabled={processing}>
                        Request Loan
                      </Button>
                    )}
                    
                    {canDownload && (
                      <Link href={route('student.books.download', book.id)}>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </Link>
                    )}
                  </div>
                  
                  {!isAvailable && (
                    <div className="p-4 bg-amber-50 text-amber-800 rounded-md">
                      <p className="text-sm">
                        This book is currently on loan. Please check back later or browse other available books.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
