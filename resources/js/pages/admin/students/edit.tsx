import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Student } from '@/types/models/student';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface Props {
    student: Student;
}

type FormData = {
    [key: string]: string;
    name: string;
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
};

export default function EditStudent({ student }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Students',
            href: '/students',
        },
        {
            title: 'Edit Student',
            href: `/students/${student.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm<FormData>({
        name: student.user.name,
        email: student.user.email,
        code: student.code,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.students.update', student.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Students
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Student</h1>
                </div>

                <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                aria-invalid={errors.name ? 'true' : 'false'}
                                aria-errormessage={errors.name ? 'name-error' : undefined}
                                className="mt-1"
                            />
                            {errors.name && (
                                <p id="name-error" className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                aria-invalid={errors.email ? 'true' : 'false'}
                                aria-errormessage={errors.email ? 'email-error' : undefined}
                                className="mt-1"
                            />
                            {errors.email && (
                                <p id="email-error" className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Registration Number</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                aria-invalid={errors.code ? 'true' : 'false'}
                                aria-errormessage={errors.code ? 'code-error' : undefined}
                                className="mt-1"
                            />
                            {errors.code && (
                                <p id="code-error" className="mt-1 text-sm text-red-600">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">New Password (optional)</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                aria-invalid={errors.password ? 'true' : 'false'}
                                aria-errormessage={errors.password ? 'password-error' : undefined}
                                className="mt-1"
                            />
                            {errors.password && (
                                <p id="password-error" className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm New Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Link href={route('admin.students.index')}>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                Update Student
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
