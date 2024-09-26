<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Reimbuse\Models\Reimburse;
use Modules\Reimbuse\Models\ReimburseType;

class BusinessTripController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reimburses = Reimburse::with('users')->get();
        $users = User::select('nip', 'name')->get();
        $types = ReimburseType::select('code', 'name')->get();
        $currencies = Currency::select('code', 'name')->get();
        $csrf_token = csrf_token();

        
        return Inertia::render('BusinessTrip/ListBusinessTrip', [
            'reimburses'    =>  $reimburses,
            'users'         =>  $users,
            'types'         =>  $types,
            'currencies'    =>  $currencies,
            'csrf_token'    =>  $csrf_token
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('businesstrip::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('businesstrip::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('businesstrip::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
