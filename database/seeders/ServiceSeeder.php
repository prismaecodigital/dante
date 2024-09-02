<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Service::create([
            'upcoming_service' => '2024-09-02',
            'customer' => 'Rizki',
            'address' => 'Gedung A',
            'service' => 'Service AC ruangan ICT',
            'status' => '1',
            'latest_service' => '2024-07-01',
        ]);

        Service::create([
            'upcoming_service' => '2024-09-22',
            'customer' => 'Rizki',
            'address' => 'Gedung A',
            'service' => 'Service AC ruangan ICT',
            'status' => '0',
            'latest_service' => '2024-07-01',
        ]);
    }
}
