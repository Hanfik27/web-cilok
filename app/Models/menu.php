<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class menu extends Model
{
    public static function menu()
    {
        $menuItems = [
            'menu1' => [
                'id' => 1,
                'name' => 'Cilok Suwir Ayam',
                'price' => [
                    'S' => 10000,
                    'M' => 15000,
                    'L' => 20000,
                ],
                'image' => 'cilok-suwir-ayam.jpg',
                'description' => 'Cilok dengan isian suwir ayam yang lezat'
            ],
            'menu2' => [
                'id' => 2,
                'name' => 'Cilok Keju',
                'price' => [
                    'S' => 12000,
                    'M' => 17000,
                    'L' => 22000,
                ],
                'image' => 'cilok-keju.jpg',
                'description' => 'Cilok dengan isian keju meleleh'
            ],
            'menu3' => [
                'id' => 3,
                'name' => 'Cilok Original',
                'price' => [
                    'S' => 8000,
                    'M' => 13000,
                    'L' => 18000,
                ],
                'image' => 'cilok-original.jpg',
                'description' => 'Cilok original dengan bumbu kacang'
            ],
            'menu4' => [
                'id' => 4,
                'name' => 'Cilok Pedas',
                'price' => [
                    'S' => 10000,
                    'M' => 15000,
                    'L' => 20000,
                ],
                'image' => 'cilok-pedas.jpg',
                'description' => 'Cilok dengan tambahan sambal pedas special'
            ],
        ];
    }
}
