<?php

namespace Modules\Approval\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\SapJobs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Modules\Approval\Models\Approval;
use Modules\Approval\Models\ApprovalRoute;
use Modules\Approval\Models\ApprovalRouteUsers;
use Modules\Approval\Services\CheckApproval;
use Modules\PurchaseRequisition\Models\Purchase;

class ApprovalController extends Controller
{
    protected $approvalServices;

    public function __construct(CheckApproval $approvalServices)
    {
        $this->approvalServices = $approvalServices;
    }
    public function index(Request $request)
    {
        $filterableColumns = [
            'group_id',
            'is_hr',
            'hr_approval',
        ];
        $data = $this->filterAndPaginate($request, ApprovalRoute::class, $filterableColumns);
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
        DB::beginTransaction();
        try {
            //code...
            $approvalRouteData = $request->only(['group_id', 'is_hr', 'hr_approval', 'user_hr_id', 'is_conditional', 'nominal']);
            $approvalRoute = ApprovalRoute::create($approvalRouteData);

            // Ambil array user_id dari request
            $userIds = $request->get('user_approvals');

            // Looping untuk insert user_id ke user_approvals
            foreach ($userIds as $userId) {
                if (isset($userId['user_id'])) {
                    ApprovalRouteUsers::create([
                        'user_id' => $userId['user_id'],
                        'approval_route_id' => $approvalRoute->id
                    ]);
                }
            }

            DB::commit();
            return $this->successResponse($request->all());
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return $this->errorResponse($th->getMessage());
        }
        //

    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $data = ApprovalRoute::with('userApprovals')->find($id);
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
    public function update(Request $request, $id)
    {
        // Cari ApprovalRoute yang akan di-update
        $approvalRoute = ApprovalRoute::findOrFail($id);

        // Update data approval_routes
        $approvalRouteData = $request->only(['group_id', 'is_hr', 'hr_approval', 'user_hr_id', 'is_conditional', 'nominal']);
        $approvalRoute->update($approvalRouteData);

        // Ambil array user_id dari request
        $userIds = $request->get('user_approvals');

        // Hapus user_approvals yang lama terkait approval_route ini
        ApprovalRouteUsers::where('approval_route_id', $approvalRoute->id)->delete();

        // Insert user_id baru ke user_approvals
        foreach ($userIds as $userId) {
            ApprovalRouteUsers::create([
                'user_id' => $userId['user_id'],
                'approval_route_id' => $approvalRoute->id
            ]);
        }

        return $this->successResponse($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $data = ApprovalRoute::find($id)->delete();
        return $this->successResponse($data);
    }

    public  function CekApproval(Request $request)
    {
        try {
            switch ($request->type) {
                case 'REIM':
                case 'TRIP':
                case 'TRIP_DECLARATION':
                    $result = $this->approvalServices->Payment($request);
                    break;
                case 'PR':
                    $result = $this->approvalServices->PR($request);
                    break;
                default:
                    return $this->errorResponse('Type not found');
            }
            return $this->successResponse($result);

            //code...
        } catch (\Throwable $th) {
            //throw $th;
            return $this->errorResponse($th->getMessage());
        }
    }

    public  function ApprovalOrRejceted(Request $request)
    {
        try {
            Approval::where('id', $request->approvalId)->where('document_id',  $request->id)
                ->update([
                    'status' => $request->status,
                    'message' => $request->note,
                    'is_status' => true
                ]);

            $this->logToDatabase(
                $request->id,
                $request->function_name,
                'INFO',
                $request->status . ' Procurement ' . Auth::user()->name . ' Pada Tanggal ' . $this->DateTimeNow(),
                $request->note
            );

            $ceksedSap = Approval::where('is_status', false)->where('document_id', $request->id)->get();
            if ($request->status == 'Rejected') {
                Purchase::where('id', $request->id)->update(['status_id' => 4]);
            }
            if ($ceksedSap->count() == 0 && $request->status == 'Approved') {
                Purchase::where('id', $request->id)->update(['status_id' => 5]);
                $this->logToDatabase(
                    $request->id,
                    $request->function_name,
                    'INFO',
                    'Generate PR TO SAP',
                    'SEND SAP SUCCESS'
                );
                $dokumnetType = 'PR';
                switch ($request->function_name) {
                    case 'procurement':
                        $dokumnetType = 'PR';
                        break;
                    case 'reim':
                        $dokumnetType = 'reim';
                        break;
                    case 'trip':
                        $dokumnetType = 'BT';
                        break;
                    case 'trip_declaration':
                        $dokumnetType = 'BTPO';
                        break;
                }

                SapJobs::dispatch($request->id, $dokumnetType);
            }

            return $this->successResponse($request->all());
            //code...
        } catch (\Throwable $th) {
            //throw $th;
            return $this->errorResponse($th->getMessage());
        }
    }
    public  function getApproval(Request $request)
    {
        try {
            $approval = Approval::with('user.divisions')->where('document_id', $request->id)->where('document_name', $request->type)->orderBy('id', 'ASC')->get();


            return $this->successResponse($approval);
            //code...
        } catch (\Throwable $th) {
            //throw $th;
            return $this->errorResponse($th->getMessage());
        }
    }
}
