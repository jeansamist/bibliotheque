import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Student {
  id: number;
  code: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface ProfileProps {
  student: Student;
  errors?: Record<string, string>;
}

export default function Profile({ student, errors }: ProfileProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Profile',
      href: route('student.profile'),
    },
  ];
  
  const { data, setData, patch, processing, reset } = useForm({
    name: student.user.name,
    email: student.user.email,
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    patch(route('student.profile.update'), {
      onSuccess: () => {
        reset('current_password', 'password', 'password_confirmation');
        toast.success('Your profile has been updated successfully.');
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Profile" />
      
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal information and student ID</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pb-6">
                <div className="mb-4 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserCircle className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold">{student.user.name}</h3>
                <p className="text-gray-500">{student.user.email}</p>
                <div className="mt-4 py-2 px-4 bg-blue-50 rounded-md text-blue-700">
                  <span className="text-sm font-medium">Student ID: {student.code}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Edit Profile Form */}
          <div className="col-span-1 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      required
                    />
                    {errors?.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                      required
                    />
                    {errors?.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={data.current_password}
                      onChange={e => setData('current_password', e.target.value)}
                    />
                    {errors?.current_password && <p className="text-sm text-red-500">{errors.current_password}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      onChange={e => setData('password', e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Leave blank to keep your current password</p>
                    {errors?.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm New Password</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      value={data.password_confirmation}
                      onChange={e => setData('password_confirmation', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                      {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
