<?php

namespace Modules\Gateway\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Gateway\Http\Requests\GatewayRequest;
use Modules\Gateway\Models\Gateway;
use Modules\Gateway\Models\GatewayValue;
use Modules\Gateway\Models\SecretKeyEmployee;

class GatewayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = Gateway::query();

        $filterableColumns = [
            'code_endpoint',
            'name',
            'tabel_name',
            'methods',
            'desc',
            'command',
            'type',
            'is_status'
        ];
        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Use the helper function
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('code_endpoint', 'like', '%' . $request->search . '%')
                    ->orWhere('name', 'like', '%' . $request->search . '%')
                    ->orWhere('tabel_name', 'like', '%' . $request->search . '%')
                    ->orWhere('methods', 'like', '%' . $request->search . '%')
                    ->orWhere('desc', 'like', '%' . $request->search . '%')
                    ->orWhere('command', 'like', '%' . $request->search . '%');
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
        return view('gateway::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GatewayRequest $request)
    {
        //
        $dataInsert = $request->all();
        $dataInsert['is_status'] = $request->is_status ?? false;
        $secret = Gateway::create($dataInsert);
        return $this->successResponse($secret);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $secret = Gateway::find($id);
        return $this->successResponse($secret);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('gateway::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
        $dataInsert = $request->all();
        $dataInsert['is_status'] = $request->is_status ?? false;
        $secret = Gateway::find($id)->update($dataInsert);
        return $this->successResponse($secret);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $secret = Gateway::find($id)->delete();
        return $this->successResponse($secret);
    }

    public function setApiPost(Request $request)
    {
        $gateway = SecretKeyEmployee::where('key', $request->header('key'))->first();
        if (!$gateway) {
            return $this->errorResponse('key not found');
        }

        $endpoint = Gateway::where('code_endpoint', $request->code_endpoint)
            ->where('is_status', true)
            ->first();
        if (!$endpoint) {
            return $this->errorResponse('endpoint not found');
        }
        DB::beginTransaction();
        try {
            //code...
            $type = $endpoint->type;
            $tabel = $endpoint->tabel_name;
            $dataRequest = $request->except('code_endpoint'); // Exclude 'code_endpoint'

            // Fetch Gateway Values and Keys once
            $valueData = GatewayValue::where('gateways_id', $endpoint->id)->get();
            $keyWhere = GatewayValue::where('gateways_id', $endpoint->id)
                ->where('is_key', true)
                ->get();

            // If no key is found for 'createOrUpdate' or 'update'
            if (($type == 'createOrUpdate' || $type == 'update') && count($keyWhere) == 0) {
                DB::rollBack();
                return $this->errorResponse('key not found, contact your admin');
            }

            // Helper to build insert/update data
            $buildDataToInsert = function ($value) use ($valueData) {
                $dataToInsert = [];
                foreach ($valueData as $vd) {
                    $dataToInsert[$vd->column_value] = $value[$vd->value] ?? "-";
                }
                return $dataToInsert;
            };

            // Helper to build key conditions
            $buildKeyConditions = function ($value) use ($keyWhere) {
                $keyValue = [];
                foreach ($keyWhere as $k) {
                    $keyValue[$k->column_value] = $value[$k->value];
                }
                return $keyValue;
            };

            // Handling different operations based on type
            foreach ($dataRequest as $key => $value) {
                $dataToInsert = $buildDataToInsert($value);
                $dataToInsert['updated_at'] = now();
                if ($type == 'create') {
                    $dataToInsert['created_at'] = now();
                    DB::table($tabel)->insert($dataToInsert);
                }

                if ($type == 'update') {
                    $updateQuery = DB::table($tabel);
                    foreach ($buildKeyConditions($value) as $column => $keyValue) {
                        $updateQuery->where($column, $keyValue);
                    }

                    $updateQuery->update($dataToInsert);
                }

                if ($type == 'createOrUpdate') {
                    DB::table($tabel)->updateOrInsert(
                        $buildKeyConditions($value),
                        $dataToInsert
                    );
                }
            }

            $this->logToDatabase($endpoint->id, 'setApiPost', 'success', 'success post data', [
                'headers' => $request->header(),
                'body' => $request->all()
            ]); // Log the request
            DB::commit();

            return $this->successResponse($dataRequest);
        } catch (\Throwable $th) {
            DB::rollBack();
            $this->logToDatabase($endpoint->id, 'setApiPost', 'error', $th->getMessage(), [
                'headers' => $request->header(),
                'body' => $request->all()
            ]); // Log the request
            return $this->errorResponse($th->getMessage());
        }
    }
}
