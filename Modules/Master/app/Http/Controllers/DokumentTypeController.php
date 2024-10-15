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
        $filterableColumns = [
            'purchasing_doc',
            'purchasing_dsc',
        ];
        $data = $this->filterAndPaginate($request, DocumentType::class, $filterableColumns);
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
