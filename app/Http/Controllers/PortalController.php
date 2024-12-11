<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PortalController extends Controller
{
    public function index()
    {
        return Inertia::render('Portal/index');
    }
}
