<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\menu;

class PageController extends Controller
{
    public function index()
    {
        $menuItems = menu::menu();
        return view('food.index', compact('menuItems'));
    }
}
