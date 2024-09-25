<?php

namespace Modules\Gateway\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Gateway\Models\GatewayValue;

class GatewayValueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function inde(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = GatewayValue::query();

        $filterableColumns = [
            'gateways_id',
            'column_value',
            'value',
            'is_key'
        ];
        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Use the helper function
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('column_value', 'like', '%' . $request->search . '%')
                    ->orWhere('value', 'like', '%' . $request->search . '%');
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
        return view('gateway::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $dataInsert = $request->all();
        $dataInsert['is_key'] = $request->is_status ?? false;
        $secret = GatewayValue::create($dataInsert);
        return $this->successResponse($secret);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $secret = GatewayValue::find($id);
        return $this->successResponse($secret);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('gateway::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
        $dataInsert = $request->all();
        $dataInsert['is_key'] = $request->is_status ?? false;
        $secret = GatewayValue::find($id)->update($dataInsert);
        return $this->successResponse($secret);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $secret = GatewayValue::find($id)->delete();
        return $this->successResponse($secret);
    }
}
