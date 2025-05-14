<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Currency;

class CurrencyController extends Controller
{
    public function index(Request $request)
    {
        $query =  Currency::query();
            $perPage = $request->get('per_page', 10);
            $sortBy = $request->sort_by == 'id' ? 'name' : $request->sort_by;
            $sortDirection = $request->get('sort_direction', 'asc');
            $query->orderBy($sortBy, $sortDirection);
        if ($request->search) $query = $query->where('code', 'ilike', '%' . $request->search . '%')
                                ->orWhere('name', 'ilike', '%' . $request->search . '%');
        $data = $query->paginate($perPage);

        $data->getCollection()->transform(function ($map) {
            return [
                'id' => $map->code,
                'code' => $map->code,
                'name' => $map->name,
            ];
        });

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
        $request->validate([
            'code' => 'required|unique:currencies,code',
        ]);
        $dataInsert = $request->except('id');
        $data = Currency::insert($dataInsert);
        return $this->successResponse($data);
    }

    /**
     * Show the specified resource.
     */
    public function show($code)
    {
        $data = Currency::where('code', $code)->first();
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
    public function update(Request $request, $code)
    {
        $request->validate([
            'code' => 'required|unique:currencies,code,' . $code . ',code',
        ]);
        $dataInsert = $request->all();
        $data = Currency::where('code', $code)->update($dataInsert);
        return $this->successResponse($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($code)
    {
        //
        $data = Currency::where('code', $code)->delete();
        return $this->successResponse($data);
    }
}
