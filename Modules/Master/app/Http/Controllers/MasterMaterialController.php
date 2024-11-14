<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Master\Models\MasterMaterial;

class MasterMaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $filterableColumns =  [
            'old_material_number',
            'external_material_group',
            'material_group',
            'material_number',
            'industry',
            'base_unit_of_measure',
            'material_type',
            'material_description',
            'plant_specific_material_status',
            'material_status_valid',
            'plant',
        ];

        $data = $this->filterAndPaginate($request, MasterMaterial::class, $filterableColumns);
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
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('master::show');
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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }

    public function getListMaterialByMaterialGroupAPI($material_group) {
        $listMaterial = MasterMaterial::where('material_group', $material_group)->get();

        return $this->successResponse($listMaterial);
    }
}
