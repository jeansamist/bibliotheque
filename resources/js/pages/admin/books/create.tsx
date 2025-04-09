import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface Category {
    value: string;
    label: string;
}

interface Props {
    categories: Category[];
}

const BookCreate: React.FC<Props> = ({ categories }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Books',
            href: '/books',
        },
        {
            title: 'Add New Book',
            href: '/books/create',
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        author: '',
        year: new Date().getFullYear(),
        type: 'physical',
        category: 'book',
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.books.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Books
                    </Button>
                    <h1 className="text-2xl font-semibold text-gray-900">Add New Book</h1>
                </div>

                <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
                    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                        <div>
                            <Label htmlFor="name">Book Title</Label>
                            <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1" />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="author">Author</Label>
                            <Input id="author" type="text" value={data.author} onChange={(e) => setData('author', e.target.value)} className="mt-1" />
                            {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
                        </div>

                        <div>
                            <Label htmlFor="year">Publication Year</Label>
                            <Input
                                id="year"
                                type="number"
                                value={data.year}
                                onChange={(e) => setData('year', parseInt(e.target.value))}
                                className="mt-1"
                            />
                            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                        </div>

                        <div>
                            <Label htmlFor="type">Book Type</Label>
                            <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select book type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="physical">Physical Book</SelectItem>
                                    <SelectItem value="file">Digital File</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                        </div>

                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select book category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                        </div>

                        {data.type === 'file' && (
                            <div>
                                <Label htmlFor="file">Book File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                    accept=".pdf,.epub,.mobi"
                                    className="mt-1"
                                />
                                {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                Add Book
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default BookCreate;
