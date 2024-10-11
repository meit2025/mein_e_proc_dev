<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\BusinessTrip\Models\AllowanceItem;
use Modules\BusinessTrip\Models\PurposeType;
use Modules\BusinessTrip\Models\PurposeTypeAllowance;

class PurposeTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
    public function index()
    {
        return inertia('BusinessTrip/PurposeType/index');
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

    public function detailAPI($id) {
        $find = PurposeType::with(['listAllowance'])->find($id);
        return $this->successResponse($find);

    }

    public function getAllowanceByPurposeAPI($id) {
        $listAllowances =  AllowanceItem::whereIn('id', PurposeTypeAllowance::where('purpose_type_id', $id)->get()->pluck('allowance_items_id')->toArray())->get();

        return $this->successResponse($listAllowances);
    }
}
