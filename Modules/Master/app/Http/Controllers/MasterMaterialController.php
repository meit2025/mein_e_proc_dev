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
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = MasterMaterial::query();

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

        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Use the helper function
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('old_material_number', 'like', '%' . $request->search . '%')
                    ->orWhere('external_material_group', 'like', '%' . $request->search . '%')
                    ->orWhere('material_group', 'like', '%' . $request->search . '%')
                    ->orWhere('industry', 'like', '%' . $request->search . '%')
                    ->orWhere('base_unit_of_measure', 'like', '%' . $request->search . '%')
                    ->orWhere('material_type', 'like', '%' . $request->search . '%')
                    ->orWhere('material_description', 'like', '%' . $request->search . '%')
                    ->orWhere('plant_specific_material_status', 'like', '%' . $request->search . '%')
                    ->orWhere('material_status_valid', 'like', '%' . $request->search . '%')
                    ->orWhere('material_number', 'like', '%' . $request->search . '%');
            });
        }

        $query->orderBy($sortBy, $sortDirection);
        $data = $query->paginate($perPage);

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
}
