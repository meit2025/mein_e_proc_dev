<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Master\Models\MasterBusinessPartner;

class MasterBusinessPartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = MasterBusinessPartner::query();

        $filterableColumns =  [
            'external_partner_number',
            'partner_grouping',
            'search_term_one',
            'name_one',
            'partner_number',
            'central_block',
            'city',
            'country',
            'postal_code',
            'tax_number',
            'number_supplier',
            'delete',
            'purchasing_block',
            'type',
        ];

        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Use the helper function
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('search_term_one', 'like', '%' . $request->search . '%')
                    ->orWhere('external_partner_number', 'like', '%' . $request->search . '%')
                    ->orWhere('partner_grouping', 'like', '%' . $request->search . '%')
                    ->orWhere('partner_number', 'like', '%' . $request->search . '%')
                    ->orWhere('form_of_address_key', 'like', '%' . $request->search . '%')
                    ->orWhere('central_block', 'like', '%' . $request->search . '%');
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
}
