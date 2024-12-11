<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Master\Models\MasterTrackingNumber;

class MasterTrackingNumberController extends Controller
{
    public function index(Request $request)
    {
        $filterableColumns =  [
            'name',
        ];

        $data = $this->filterAndPaginate($request, MasterTrackingNumber::class, $filterableColumns);
        return $this->successResponse($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $dataInsert = $request->all();
        $data = MasterTrackingNumber::create($dataInsert);
        return $this->successResponse($data);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $data = MasterTrackingNumber::find($id);
        return $this->successResponse($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $dataInsert = $request->all();
        $data = MasterTrackingNumber::find($id)->update($dataInsert);
        return $this->successResponse($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $data = MasterTrackingNumber::find($id)->delete();
        return $this->successResponse($data);
    }
}
