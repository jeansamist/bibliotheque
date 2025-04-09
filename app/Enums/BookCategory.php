<?php

namespace App\Enums;

enum BookCategory: string
{
    case Book = 'book';
    case TestCorrection = 'test_correction';
    case CourseMaterial = 'course_material';
    case InternshipReport = 'internship_report';

    public function label(): string
    {
        return match($this) {
            self::Book => 'Book',
            self::TestCorrection => 'Test/Correction',
            self::CourseMaterial => 'Course Material',
            self::InternshipReport => 'Internship Report',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
