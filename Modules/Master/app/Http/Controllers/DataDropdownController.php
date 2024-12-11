<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Master\Models\DataDropdown;

class DataDropdownController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('master::index');
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
        $data = DataDropdown::updateOrCreate(
            [
                'doc_id' => $dataInsert['doc_id'],
                'dropdown_type' => $dataInsert['dropdown_type'],
                'field_name' => $dataInsert['field_name']
            ],
            $dataInsert
        );
        return $this->successResponse($data);
    }

    /**
     * Show the specified resource.
     */
    public function show($id, $type, Request $request)
    {
        $data = DataDropdown::where('doc_id', $id)->where('dropdown_type', $type);

        if ($request->has('search')) {
            $data = $data->where('field_name', '=', $request->search);
        }
        $data = $data->first();
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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
