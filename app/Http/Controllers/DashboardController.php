<?php

namespace App\Http\Controllers;

use App\Events\NotifikasiUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //
    public function index()
    {
        // return view('welcome');
        return Inertia::render('Dashboard/index', [
            'title' => 'Dashboard',
        ]);
    }

    public function roles()
    {
        return Inertia::render('Role/index', [
            'title' => 'Dashboard',
        ]);
    }
}
