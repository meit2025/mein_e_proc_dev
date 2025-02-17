<?php

namespace Modules\Approval\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\SapJobs;
use App\Jobs\SendNotification;
use App\Mail\ChangeStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Modules\Approval\Models\Approval;
use Modules\Approval\Models\ApprovalRoute;
use Modules\Approval\Models\ApprovalRouteUsers;
use Modules\Approval\Services\CheckApproval;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\PurchaseRequisition\Models\Purchase;

use Modules\Reimbuse\Models\ReimburseGroup;

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
            $approvalRouteData['nominal'] = $request->is_conditional ? $request->nominal : 0;
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
        $approvalRouteData['nominal'] = $request->is_conditional ? $request->nominal : 0;
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
        DB::beginTransaction();
        try {
            $dokumnetType = 'PR';
            $dokumentApproval = 'PR';
            $dokumentName = 'Purchase Requisition';
            $idSap = $request->id;
            switch ($request->function_name) {
                case 'procurement':
                    $dokumnetType = 'PR';
                    $dokumentApproval = 'PR';
                    break;
                case 'reim':
                    $dokumnetType = 'REIM';
                    $dokumentApproval = 'REIM';
                    $dokumentName = 'Reimburse';
                    break;
                case 'trip':
                    $dokumnetType = 'BT';
                    $dokumentApproval = 'TRIP';
                    $dokumentName = 'Business Trip';
                    break;
                case 'trip_declaration':
                    $dokumnetType = 'BTPO';
                    $dokumentApproval = 'TRIP_DECLARATION';
                    $dokumentName = 'Business Trip Declaration';
                    break;
            }

            if ($request->status != 'Cancel') {
                Approval::where('id', $request->approvalId)->where('document_id',  $request->id)
                ->where('document_name', $dokumentApproval)
                ->update([
                    'status' => $request->status,
                    'message' => $request->note,
                    'is_status' => true,
                    'is_approval' => false
                ]);
                
                $dataNext = Approval::where('id', $request->approvalId)->where('document_id',  $request->id)
                ->where('document_name', $dokumentApproval)->first();
                
                if ($dataNext) {
                    Approval::where('document_id',  $request->id)
                    ->where('number_approval', $dataNext->number_approval + 1)
                    ->where('document_name', $dokumentApproval)->update([
                        'is_approval' => true
                    ]);
                }
            }
            $message = $dokumentName .  ' Document ' . $request->status . '  ' .  ' by ' . Auth::user()->name . ' At ' . $this->DateTimeNow();

            $ceksedSap = Approval::where('is_status', false)->where('document_id', $request->id)
                ->where('id', '!=', $request->approvalId)
                ->where('document_name', $dokumentApproval)
                ->get();

            $modelMap = [
                'procurement' => Purchase::class,
                'reim' => ReimburseGroup::class,
                'trip' => BusinessTrip::class,
                'trip_declaration' => BusinessTrip::class
            ];
            $statusId = 0;

            switch ($request->status) {
                case 'Rejected':
                    # code...
                    $statusId = 4;
                    break;
                case 'Cancel':
                    # code...
                    $statusId = 2;
                    break;
                case 'Revise':
                    # code...
                    $statusId = 6;
                    break;

                default:
                    # code...
                    if ($ceksedSap->count() == 0 && $request->status == 'Approved') {
                        $statusId = 3;
                    } else {
                        $statusId = 0;
                    }
                    break;
            }
            // dd('zz');
            if (isset($modelMap[$request->type]) && $statusId != 0) {
                $modelMap[$request->type]::where('id', $request->id)->update(['status_id' => $statusId]);
            }
            $this->logToDatabase(
                $request->id,
                $request->function_name,
                'INFO',
                $message,
                $request->note
            );

            // send notifikasi
            if (isset($modelMap[$request->type])) {
                try {
                    //code...
                    $model = $modelMap[$request->type]::find($request->id);
                    switch ($request->function_name) {
                        case 'procurement':
                            $baseurl = env('APP_URL') .  '/purchase-requisition/detail/' .  $request->id;

                            $findUser = User::find($model->user_id);
                            SendNotification::dispatch($findUser,  $message, $baseurl);
                            $purchase = $modelMap[$request->type]::with('vendorsWinner.units', 'vendorsWinner.masterBusinesPartnerss', 'createdBy', 'user', 'purchaseRequisitions')->find($request->id);
                            // find pr number
                            $pr = $purchase->purchases_number;


                            Mail::to($findUser->email)->send(new ChangeStatus($findUser, 'Purchase Requisition', $request->status, $pr, $purchase, null, null, $baseurl));

                            if ($model->user_id !== $model->createdBy) {
                                $findcreatedBy = User::find($model->createdBy);
                                Mail::to($findcreatedBy->email)->send(new ChangeStatus($findcreatedBy, 'Purchase Requisition', $request->status, $pr, $purchase, null, null, $baseurl));
                                SendNotification::dispatch($findcreatedBy,  $message, $baseurl);
                            }
                            break;
                        case 'reim':
                            $baseurl = env('APP_URL') .  '/reimburse/detail/' .  $request->id;
                            $findUser = User::where('nip', $model->requester)->first();
                            $reimburseGroup = ReimburseGroup::with(['reimburses.reimburseType'])->find($request->id);
                            $reimburseGroup->notes = isset($request->note) ? $request->note : '';
                            $getApproval = Approval::where(['document_id' => $request->id, 'document_name' => 'REIM', 'status' => 'Waiting'])->orderBy('id', 'ASC')->first();

                            if (in_array($statusId, [3, 4, 6])) {
                                SendNotification::dispatch($findUser,  $message, $baseurl);
                                Mail::to($findUser->email)->send(new ChangeStatus($findUser, 'Reimbursement', $request->status, '', null, $reimburseGroup, null, $baseurl));
                            } 
                            // else if ($statusId == 1 && !empty($getApproval)) {
                            //     $findcreatedBy = User::find($getApproval->user_id);
                            //     Mail::to($findcreatedBy->email)->send(new ChangeStatus($findcreatedBy, 'Reimbursement', 'Approver', '', null, $reimburseGroup, null, $baseurl));
                            //     SendNotification::dispatch($findcreatedBy,  $message, $baseurl);
                            // }
                            break;
                        case 'trip_declaration':
                        case 'trip':
                            $baseurl = env('APP_URL') .  '/business-trip/detail-page/' .  $request->id;
                            $findUser = User::where('id', $model->request_for)->first();
                            SendNotification::dispatch($findUser,  $message, $baseurl);

                            Mail::to($findUser->email)->send(new ChangeStatus($findUser, 'Business Trip',  $request->status, '', null, null, null, $baseurl));

                            if ($findUser->id !== $model->created_by) {
                                $findcreatedBy = User::find($model->created_by);
                                Mail::to($findcreatedBy->email)->send(new ChangeStatus($findcreatedBy, 'Business Trip',  $request->status, '', null, null, null, $baseurl));
                                SendNotification::dispatch($findcreatedBy,  $message, $baseurl);
                            }
                            break;
                    }
                } catch (\Throwable $th) {
                    DB::rollBack();
                    return $this->errorResponse($th->getMessage());
                }
            }

            if ($statusId == 3) {
                if ($request->function_name == 'trip_declaration') {
                    $pr = BusinessTrip::find($request->id);
                    $idSap = $pr->parent_id;
                }
                $this->handlesendText($idSap, $dokumnetType);
                $this->logToDatabase(
                    $request->id,
                    $request->function_name,
                    'INFO',
                    'Generate PR TO SAP',
                    'SEND SAP SUCCESS'
                );
            }

            DB::commit();
            return $this->successResponse($request->all());
            //code...
        } catch (\Throwable $th) {
            DB::rollBack();
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
