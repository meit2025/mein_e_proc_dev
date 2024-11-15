<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Modules\BusinessTrip\Models\Destination;

class DestinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {


        return
            inertia('BusinessTrip/Destination/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('businesstrip::create');
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
        return view('businesstrip::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('businesstrip::edit');
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

    public function listAPI(Request $request)
    {

        $query =  Destination::query();

        // dd($query->get());
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');




        $query->orderBy($sortBy, $sortDirection);

        $data = $query->paginate($perPage);

        // dd($data);

        $data->getCollection()->transform(function ($map) {



            return [
                'code' => $map->code,
                'id' => $map->code,
                'destination' => $map->destination,
                'type' => $map->type // You can join multiple relations here if it's an array
            ];
        });


        return $this->successResponse($data);
    }

    public function updateAPI($id, Request $request)
    {

        $rules = [
            // 'code' => 'required',
            'destination' => 'required',
            'type' => 'required',
        ];

        $validator =  Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->errorResponse('erorr created', 400, $validator->errors());
        }

        DB::beginTransaction();

        try {

            Destination::where('code', $id)->update([
                'type' => $request->type,
                'destination' => $request->destination
            ]);
            DB::commit();
            return $this->successResponse('Susccessfully', 'Successfully update purpose type');
        } catch (\Exception $e) {
            dd($e);

            DB::rollBack();
        }
    }

    public function storeApi(Request $request)
    {

        $rules = [
            'code' => 'required',
            'type' => 'required',
            'destination' => 'required',
        ];

        $validator =  Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return $this->errorResponse('erorr created', 400, $validator->errors());
        }

        DB::beginTransaction();

        try {
            $purpose =  new Destination();

            $purpose->code =  $request->code;
            $purpose->destination = $request->destination;
            $purpose->type = $request->type;

            $purpose->save();



            DB::commit();

            return $this->successResponse($purpose, 'Successfully creeted purpose type');
        } catch (\Exception $e) {
            dd($e);

            DB::rollBack();
        }
    }

    public function deleteAPI($id)
    {
        DB::beginTransaction();
        try {
            $findPurposeType =  Destination::where('code', $id);
            $findPurposeType->delete();
            DB::commit();

            return $this->successResponse([], 'Successfully delete purpose type');
        } catch (\Exception  $e) {
            DB::rollBack();

            return $this->errorResponse($e);
        }
    }

    public function detailAPI($id)
    {
        $find = Destination::where('code', $id)->first();



        $context = [
            'destination' => $find
        ];
        return $this->successResponse($context);
    }
}
