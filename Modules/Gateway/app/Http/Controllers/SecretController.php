<?php

namespace Modules\Gateway\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Gateway\Http\Requests\CreateSecret;
use Modules\Gateway\Models\SecretKeyEmployee;

class SecretController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = SecretKeyEmployee::query();

        $filterableColumns = ['key', 'employee', 'secret_key', 'desc'];
        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Use the helper function
            }
        }

        if ($request->search) {
            $query->where('employee', 'like', '%' . $request->search . '%');
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
    public function store(CreateSecret $request)
    {
        $dataInsert = $request->all();
        $dataInsert['is_status'] = $request->is_status ?? false;
        $secret = SecretKeyEmployee::create($dataInsert);
        return $this->successResponse($secret);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $secret = SecretKeyEmployee::find($id);
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
    public function update(CreateSecret $request, $id)
    {
        $dataInsert = $request->all();
        $dataInsert['is_status'] = $request->is_status ?? false;
        $secret = SecretKeyEmployee::find($id)->update($dataInsert);
        return $this->successResponse($secret);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $secret = SecretKeyEmployee::find($id)->delete();
        return $this->successResponse($secret);
    }
}
