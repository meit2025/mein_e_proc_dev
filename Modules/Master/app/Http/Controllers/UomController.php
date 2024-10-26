<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Master\Models\Uom;

class UomController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterableColumns =  [
            'internal_uom',
            'iso_code',
            'commercial',
            'measurement_unit_text',
            'unit_of_measurement_text',
        ];

        $data = $this->filterAndPaginate($request, Uom::class, $filterableColumns);
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
        $data = Uom::create($dataInsert);
        return $this->successResponse($data);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $data = Uom::find($id);
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
        $data = Uom::find($id)->update($dataInsert);
        return $this->successResponse($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $data = Uom::find($id)->delete();
        return $this->successResponse($data);
    }
}
