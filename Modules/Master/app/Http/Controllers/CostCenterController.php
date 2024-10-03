<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Master\Models\MasterCostCenter;

class CostCenterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = MasterCostCenter::query();

        $filterableColumns =  [
            'controlling_area',
            'controlling_name',
            'cost_center',
            'valid_form',
            'valid_to',
            'company_code',
            'company_name',
            'desc',
            'standard_hierarchy_area',
            'short_desc_set',
            'profile_center',
            'long_text',
        ];

        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Use the helper function
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('controlling_area', 'like', '%' . $request->search . '%')
                    ->orWhere('controlling_name', 'like', '%' . $request->search . '%')
                    ->orWhere('cost_center', 'like', '%' . $request->search . '%')
                    ->orWhere('valid_form', 'like', '%' . $request->search . '%')
                    ->orWhere('valid_to', 'like', '%' . $request->search . '%')
                    ->orWhere('company_code', 'like', '%' . $request->search . '%')
                    ->orWhere('company_name', 'like', '%' . $request->search . '%')
                    ->orWhere('desc', 'like', '%' . $request->search . '%')
                    ->orWhere('standard_hierarchy_area', 'like', '%' . $request->search . '%')
                    ->orWhere('short_desc_set', 'like', '%' . $request->search . '%')
                    ->orWhere('profile_center', 'like', '%' . $request->search . '%')
                    ->orWhere('long_text', 'like', '%' . $request->search . '%');
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
