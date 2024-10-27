<?php

namespace Modules\Master\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Modules\Master\Models\Family;

class FamilyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query =  Family::query()->with(['user']);
            $perPage = $request->get('per_page', 10);
            $sortBy = $request->get('sort_by', 'id');
            $sortDirection = $request->get('sort_direction', 'asc');
            $query->orderBy($sortBy, $sortDirection);
            $data = $query->paginate($perPage);
            $data->getCollection()->transform(function ($map) {
                $map = json_decode($map);
                return [
                    'id' => $map->id,
                    'name' => $map->name,
                    'status' => $map->status,
                    'bod' => $map->bod,
                    'user' => "( " . $map->user->nip . " )" . " - " . $map->user->name,
                ];
            });
            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage());
        }
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
        $rules = [
            'name' => 'required',
            'status' => 'required|in:wife,child',
            'bod' => 'required|date',
            'user' => 'required|exists:users,nip',
        ];

        try {
            foreach ($request->families as $family) {
                DB::beginTransaction();
                $family['user'] = $request->user;
                $validator = Validator::make($family, $rules);
                if ($validator->fails()) {
                    return $this->errorResponse($validator->errors());
                }
                $validatedData = $validator->validated();
                Family::create($validatedData);
            }
            DB::commit();
            return $this->successResponse("Create Family Member Successfully");
        } catch (\Exception  $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage());
        }
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
