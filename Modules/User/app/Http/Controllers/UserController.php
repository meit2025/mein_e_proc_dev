<?php

namespace Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = User::query();

        $filterableColumns =  [
            'nip',
            'name',
            'email',
            'role',
            'job_level',
            'division',
            'immediate_spv',
        ];

        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Use the helper function
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nip', 'like', '%' . $request->search . '%')
                    ->orWhere('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
                    ->orWhere('role', 'like', '%' . $request->search . '%')
                    ->orWhere('job_level', 'like', '%' . $request->search . '%')
                    ->orWhere('division', 'like', '%' . $request->search . '%')
                    ->orWhere('immediate_spv', 'like', '%' . $request->search . '%');
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
        return view('user::create');
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
        return view('user::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('user::edit');
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
