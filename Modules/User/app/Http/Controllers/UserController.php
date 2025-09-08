<?php

namespace Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $query = User::with(['role', 'positions', 'divisions', 'departements']);

        $filterableColumns =  [
            'nip',
            'name',
            'email',
            'username',
        ];

        $hasColumns =  [
            [
                "join" => "role",
                "column" => "name",
            ],
            [
                "join" => "positions",
                "column" => "name",
            ],
            [
                "join" => "divisions",
                "column" => "name",
            ],
            [
                "join" => "departements",
                "column" => "name",
            ],
        ];




        $data = $this->filterAndPaginateHasJoin($request, $query, $filterableColumns, $hasColumns, false);
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
        $dataInsert = $request->all();
        $dataInsert['password'] = Hash::make($request->password);
        $secret = User::create($dataInsert);
        return $this->successResponse($secret);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $user = User::with(['role', 'positions', 'divisions', 'departements', 'employee'])->find($id);
        return $this->successResponse($user);
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
        $dataInsert = $request->all();
        $data = User::find($id)->update($dataInsert);
        return $this->successResponse($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $data = User::find($id)->delete();
        return $this->successResponse($data);
    }

    public function changePassword(Request $request, $id)
    {
        // Validasi input menggunakan Validator
        $validator = Validator::make($request->all(), [
            'password' => 'required|string|confirmed|min:8',
        ]);

        // Jika validasi gagal, kembalikan respons error
        if ($validator->fails()) {
            $errorString = implode(', ', $validator->errors()->all());
            return $this->errorResponse($errorString, 400, $validator->errors());
        }


        // Ambil pengguna yang sedang login
        $user = User::find($id);
        // Update password dengan password baru
        $user->forceFill([
            'password' => Hash::make($request->password),
        ])->save();

        return $this->successResponse($user);
    }
}
