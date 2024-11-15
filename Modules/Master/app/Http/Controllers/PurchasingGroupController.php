<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Master\Models\PurchasingGroup;

class PurchasingGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // 'purchasing_group',
    // 'purchasing_group_desc',
    public function index(Request $request)
    {
        $filterableColumns =  [
            'purchasing_group',
            'purchasing_group_desc',
        ];

        $data = $this->filterAndPaginate($request, PurchasingGroup::class, $filterableColumns);
        return $this->successResponse($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('master::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $dataInsert = $request->all();
        $data = PurchasingGroup::create($dataInsert);
        return $this->successResponse($data);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $data = PurchasingGroup::find($id);
        return $this->successResponse($data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('master::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
        $dataInsert = $request->all();
        $data = PurchasingGroup::find($id)->update($dataInsert);
        return $this->successResponse($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $data = PurchasingGroup::find($id)->delete();
        return $this->successResponse($data);
    }
}
