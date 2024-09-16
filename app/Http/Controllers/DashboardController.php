<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //
    public function index() {
        return Inertia::render('Dashboard/index', [
            'title' => 'Dashboard',
        ]);
    }

    public function roles() {
        return Inertia::render('Role/index', [
            'title' => 'Dashboard',
        ]);
    }
}
