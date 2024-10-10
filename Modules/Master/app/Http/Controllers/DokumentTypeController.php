<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Master\Models\DocumentType;

class DokumentTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = DocumentType::query();

        $filterableColumns = [
            'purchasing_doc',
            'purchasing_dsc',
        ];
        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Use the helper function
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('purchasing_doc', 'ilike', '%' . $request->search . '%')
                    ->orWhere('purchasing_dsc', 'ilike', '%' . $request->search . '%');
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
        $dataInsert = $request->all();
        $secret = DocumentType::create($dataInsert);
        return $this->successResponse($secret);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $secret = DocumentType::find($id);
        return $this->successResponse($secret);
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
        $secret = DocumentType::find($id)->update($dataInsert);
        return $this->successResponse($secret);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $secret = DocumentType::find($id)->delete();
        return $this->successResponse($secret);
    }
}
