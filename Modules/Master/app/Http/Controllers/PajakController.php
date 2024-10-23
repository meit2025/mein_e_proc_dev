<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Master\Models\Pajak;

class PajakController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // 'desimal',
    // 'mwszkz',
    // 'description'
    public function index(Request $request)
    {
        $filterableColumns =  [
            'desimal',
            'mwszkz',
            'description'
        ];

        $data = $this->filterAndPaginate($request, Pajak::class, $filterableColumns);
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
        $data = Pajak::create($dataInsert);
        return $this->successResponse($data);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $data = Pajak::find($id);
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
        $data = Pajak::find($id)->update($dataInsert);
        return $this->successResponse($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $data = Pajak::find($id)->delete();
        return $this->successResponse($data);
    }
}
