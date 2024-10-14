<?php

namespace Modules\BusinessTrip\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Modules\BusinessTrip\Models\BusinessTripGrade;
use Modules\BusinessTrip\Models\BusinessTripGradeUser;

class BusinessTripGradeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $listUser =  User::get();

        // return Inertia::render('BusinessTrip/BusinessTrip/index', compact('users', 'listPurposeType'));

        return inertia('BusinessTrip/BusinessGrade/index', compact('listUser'));
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

    public function listAPI(Request $request) {

        $query =  BusinessTripGrade::query()->with(['gradeUsers']);



        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);


        $data = $query->paginate($perPage);

        // dd($data);
        $data->getCollection()->transform(function ($map) {
            // dd($map->gradeUsers);
            return [
                'id' => $map->id,
                'grade' => $map->grade,
                // 'users' => $map->name,
            ];
        });



        return $this->successResponse($data);
    }

    public function storeAPI(Request $request)
    {
        
        $rules = [
            'grade' => 'required'
        ];

        $validator = Validator::make($request->all(), $rules);

        if($validator->fails()) {
            return $this->errorResponse('Erorr creating grade', 400, $validator->errors());
        }

        DB::beginTransaction();

        try
        {
            $grade = new BusinessTripGrade();

            $grade->grade = $request->grade;

            
            $grade->save();

            $users = [];

            foreach($request->users as $user) {
                array_push($users, [
                    'grade_id' => $grade->id,
                    'user_id' => $user
                ]);
            }
            // dd($users);

            BusinessTripGradeUser::insert($users);

            DB::commit();
            return $this->successResponse($grade, 'Successfully created grade');
        }
        catch(\Exception $e) {
            return $this->errorResponse($e);
            DB::rollBack();
        }
    }

    public function detailAPI($id) {
        $data = BusinessTripGrade::find($id);

        return $this->successResponse($data);
    }
}
