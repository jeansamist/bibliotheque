<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookController;
use App\Http\Controllers\StudentController;
use App\Http\Middleware\CheckUserRole;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Book admin routes (only for admin and root)
        Route::controller(BookController::class)
            ->middleware(CheckUserRole::class . ':admin,root')
            ->group(function () {
                Route::get('/books', 'index')->name('books.index');
                Route::get('/books/create', 'create')->name('books.create');
                Route::post('/books', 'store')->name('books.store');
                Route::get('/books/{book}/edit', 'edit')->name('books.edit');
                Route::patch('/books/{book}', 'update')->name('books.update');
                Route::delete('/books/{book}', 'destroy')->name('books.destroy');
                Route::get('/books/{book}/download', 'download')->name('books.download');
            });

        // Student admin routes (only for admin and root)
        Route::controller(StudentController::class)
            ->middleware(CheckUserRole::class . ':admin,root')
            ->group(function () {
                Route::get('/students', 'index')->name('students.index');
                Route::get('/students/create', 'create')->name('students.create');
                Route::post('/students', 'store')->name('students.store');
                Route::get('/students/{student}/edit', 'edit')->name('students.edit');
                Route::patch('/students/{student}', 'update')->name('students.update');
                Route::delete('/students/{student}', 'destroy')->name('students.destroy');
                Route::get('/students/{student}', 'show')->name('students.show');
                Route::get('/students/{student}/loans', 'loans')->name('students.loans');
                Route::post('/students/{student}/assign-book', 'assignBook')->name('students.assignBook');
                Route::post('/students/{student}/return-book/{loan}', 'returnBook')->name('students.returnBook');
            });
    });

    // Public book routes for all authenticated users
    Route::controller(BookController::class)->group(function () {
        Route::get('/books', 'index')->name('books.index');
        Route::get('/books/{book}', 'show')->name('books.show');
    });
    
    // Student portal routes (only for students)
    Route::prefix('student')->name('student.')->middleware(CheckUserRole::class . ':student')->group(function () {
        Route::controller(App\Http\Controllers\StudentPortalController::class)->group(function () {
            // Dashboard
            Route::get('/dashboard', 'dashboard')->name('dashboard');
            
            // Profile management
            Route::get('/profile', 'profile')->name('profile');
            Route::patch('/profile', 'updateProfile')->name('profile.update');
            
            // Books catalog
            Route::get('/books', 'books')->name('books');
            Route::get('/books/{book}', 'bookDetails')->name('books.show');
            Route::get('/books/{book}/download', 'downloadBook')->name('books.download');
            
            // Loans management
            Route::get('/loans/active', 'activeLoans')->name('loans.active');
            Route::get('/loans/history', 'loanHistory')->name('loans.history');
            Route::post('/loans/request', 'requestLoan')->name('loans.request');
        });
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
