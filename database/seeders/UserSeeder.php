<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate the table
        User::truncate();

        // CSV Method
            // Open the CSV file
            $csvFile = fopen(base_path('database/seeders/data/csv/user.csv'), 'r');

            // Skip the header row
            fgetcsv($csvFile);

            // Iterate over each row of the file
            while (($row = fgetcsv($csvFile)) !== false) {
                // Use create() to automatically generate UUID for 'id'
                User::create([
                    'nama' => $row[0],
                    'email' => $row[1],
                    'role' => $row[2],
                    'no_telepon' => $row[3],
                    'password'=> bcrypt($row[4]),
                ]);
            }

            // Close the file
            fclose($csvFile);
        // End of CSV Method

        // // SQL Method
        //     $sqlFile = base_path('database/seeders/data/sql/kontak.sql');

        //     // Check if the file exists
        //     if (file_exists($sqlFile)) {
        //         // Execute the SQL commands
        //         DB::unprepared(file_get_contents($sqlFile));
        //     } else {
        //         // Log or handle the error appropriately
        //         echo "SQL file not found: {$sqlFile}\n";
        //     }


        //     // Reset the sequence for the 'id' column in the 'kontak' table
        //     DB::statement("SELECT setval(pg_get_serial_sequence('kontak', 'id'), COALESCE(MAX(id)+1, 1), false) FROM kontak;");
        // // End of SQL Method
    }
}
