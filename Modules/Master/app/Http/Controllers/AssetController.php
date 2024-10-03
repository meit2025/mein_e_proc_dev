<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Master\Models\MasterAsset;

class AssetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = MasterAsset::query();

        $filterableColumns =  [
            'company_code',
            'company_name',
            'asset',
            'asset_subnumber',
            'asset_class',
            'asset_class_desc',
            'desc',
            'inventory_number',
            'qty',
            'base_unit_of_measure',
            'delete'
        ];

        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Use the helper function
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('company_name', 'like', '%' . $request->search . '%')
                    ->orWhere('company_code', 'like', '%' . $request->search . '%')
                    ->orWhere('asset', 'like', '%' . $request->search . '%')
                    ->orWhere('asset_subnumber', 'like', '%' . $request->search . '%')
                    ->orWhere('asset_class', 'like', '%' . $request->search . '%')
                    ->orWhere('asset_class_desc', 'like', '%' . $request->search . '%')
                    ->orWhere('desc', 'like', '%' . $request->search . '%')
                    ->orWhere('inventory_number', 'like', '%' . $request->search . '%')
                    ->orWhere('qty', 'like', '%' . $request->search . '%')
                    ->orWhere('base_unit_of_measure', 'like', '%' . $request->search . '%');
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
