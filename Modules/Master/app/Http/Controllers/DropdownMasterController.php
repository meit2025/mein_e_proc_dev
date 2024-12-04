<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Master\Models\DataDropdown;

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
        $data = DB::table($request->tabelname)->select($request->name . ' as label', $request->id . ' as value');

        if ($request->search) {
            $data = $data->where($request->name, 'ilike', '%' . $request->search . '%');
        }

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

        // cek where data dari data dropdown document type
        if ($request->tabelname && $request->attribut) {
            $dokumnTypeData = DataDropdown::where('dropdown_type', 'dokumeType')->where('field_name', $request->attribut)->first();
            if ($dokumnTypeData) {
                $array = explode(",", $dokumnTypeData->data_dropdown);
                $data = $data->whereIn('account', $array);
            }
        }

        if ($request->tabelname && $request->attribut) {
            $dokumnTypeData = DataDropdown::where('dropdown_type', 'dokumeType_material_group')->where('field_name', $request->attribut)->first();
            if ($dokumnTypeData) {
                $array = explode(",", $dokumnTypeData->data_dropdown);
                $data = $data->whereIn('id', $array);
            }
        }


        $data = $data->limit(175)->get();
        return $this->successResponse($data);
    }
    function show_tabel(Request $request)
    {
        $data = DB::table('information_schema.tables')
            ->select('table_name as label', 'table_name as value')
            ->where('table_schema', 'public') // Hanya tabel di schema 'public'
            ->get();
        return $this->successResponse($data);
    }
}
