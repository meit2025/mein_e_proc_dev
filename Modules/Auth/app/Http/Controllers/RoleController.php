<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Auth\Http\Requests\RoleRequest;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterableColumns =  [
            'name',
            'guard_name',
        ];
        $data = $this->filterAndPaginate($request, Role::with('permissions'), $filterableColumns);
        return $this->successResponse($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('auth::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        // Buat role baru
        $role = Role::create(['name' => $request['name']]);

        // Sinkronkan permissions dengan role
        if (!empty($request['permissions_array'])) {
            $role->syncPermissions($request['permissions_array']);
        }
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $data = Role::with('permissions')->find($id);
        $permissions = $data->permissions->map(function ($permission) {
            $nameParts = $permission->name;
            return $nameParts;
        });

        $result = $data;
        $result['permissions_array'] = $permissions;
        return $this->successResponse($result);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('auth::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        //
        $role->name = $request->input('name');
        $role->save();

        // Sinkronkan permissions dengan role
        $role->syncPermissions($request->input('permissions_array', []));
        return $this->successResponse($role);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $data = Role::find($id)->delete();
        return $this->successResponse($data);
    }
}
