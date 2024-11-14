<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DropdownMasterController extends Controller
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


    function dropdown(Request $request)
    {
        $selectLabel = str_contains($request->name, 'CONCAT(') ? str_replace('`', '"', $request->name) :  $request->name;
        $data = DB::table($request->tabelname)->select($selectLabel . ' as label', $request->id . ' as value');

        if ($request->key && $request->parameter) {
            $data = $data->where($request->key, $request->parameter);
        }

        if ($request->isNotNull && $request->key) {
            $data = $data->whereNotNull($request->key);
        }

        if ($request->groupBy) {
            $groupByColumns = explode(',', $request->groupBy);
            $data = $data->groupBy($groupByColumns);
        }

        $data = $data->limit(75)->get();
        return $this->successResponse($data);
    }
}
