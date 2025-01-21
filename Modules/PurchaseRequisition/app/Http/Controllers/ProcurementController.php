<?php

namespace Modules\PurchaseRequisition\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\SapJobs;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Approval\Models\Approval;
use Modules\PurchaseRequisition\Http\Requests\Procurement as RequestsProcurement;
use Modules\PurchaseRequisition\Models\CashAdvancePurchases;
use Modules\PurchaseRequisition\Models\Item;
use Modules\PurchaseRequisition\Models\Procurement;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\PurchaseRequisition\Models\Vendor;
use Modules\PurchaseRequisition\Models\VendorUnit;
use Modules\Approval\Services\CheckApproval;

class ProcurementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $approvalServices;

    public function __construct(CheckApproval $approvalServices)
    {
        $this->approvalServices = $approvalServices;
    }
    public function index(Request $request)
    {
        $filterableColumns = [
            'user_id',
            'document_type',
            'purchasing_groups',
            'delivery_date',
            'storage_locations',
            'total_vendor',
            'total_item',
            'purchases_number',
        ];

        $data = Purchase::with('status', 'updatedBy', 'createdBy', 'user');

        $data = $this->filterAndPaginate($request, $data, $filterableColumns, true);
        return $this->successResponse($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('purchaserequisition::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RequestsProcurement $request)
    {

        DB::beginTransaction();
        try {
            //code...
            $dataInsert = $request->all();
            $dataInsert['total_item'] = count($request['vendors'][0]['units']);
            $dataInsert['createdBy'] = Auth::user()->id;
            $dataInsert['purchases_number'] = 'PR' . '-' . Carbon::now()->format('Y-m') . '-' . $this->IncrementTotalData('purchases');
            $purchase = Purchase::create($dataInsert);

            if ($request['entertainment']) {
                $entertain = $purchase->entertainment()->create($request['entertainment']);
            }

            foreach ($request['vendors'] as $vendorData) {
                $vendor = $purchase->vendors()->create(
                    [
                        'vendor' => $vendorData['vendor'] ?? null,
                        'winner' => $vendorData['winner'] ?? false,
                        'vendor_name_text' => $vendorData['vendor_name_text'] ?? null,
                        'type_vendor' => $vendorData['type_vendor'] ?? null,
                    ]
                );
                foreach ($vendorData['units'] as $unitData) {
                    $unitCrate =  $vendor->units()->create($unitData);
                }
            }

            $date = Carbon::now();
            $formattedDate = $date->format('Y-m-d');

            if ($request->is_cashAdvance ?? false) {
                $purchase->cashAdvancePurchases()->create([
                    'unit_id' => $unitCrate->id,
                    'reference' => $request['cash_advance_purchases']['reference'] ?? '',
                    'document_header_text' => $request['entertainment']['header_not'] ?? '',
                    'document_date' => $formattedDate,
                    'due_on' => $request->delivery_date ?? '',
                    'text' => $request['entertainment']['header_not'] ?? '',
                    'dp' => $request['cash_advance_purchases']['dp'] ?? '',
                    'nominal' => $request['cash_advance_purchases']['nominal'] ?? '0',
                ]);
            }

            if ($request->has('attachment') && is_array($request->attachment) && count($request->attachment) > 0) {
                foreach ($request->attachment as $key => $value) {
                    # code...
                    $path = $this->saveBase64Image($value['file_path'], 'purchaserequisition');
                    $purchase->attachment()->create([
                        'file_name' => $value['file_name'],
                        'file_path' => ltrim($path, '/'),
                    ]);
                }
            }

            $this->approvalServices->PR($request, true, $purchase->id);
            DB::commit();
            $this->logToDatabase(
                $purchase->id,
                'procurement',
                'INFO',
                'Create Procurement Di Create Oleh User ' . Auth::user()->name . ' Pada Tanggal ' . $this->DateTimeNow(),
                $request->all()
            );


            return $this->successResponse($request->all());
        } catch (\Throwable $th) {
            Log::channel('purchasing_txt')->error($th, ['request' => Auth::user()->name]);
            DB::rollBack();
            return $this->errorResponse("Error: contact your administrator," . " error : " . $th->getMessage());
        }
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $procurement = Purchase::with('vendors.units.cashAdvancePurchases', 'entertainment', 'cashAdvancePurchases', 'attachment', 'status', 'createdBy', 'updatedBy')->find($id);
        $approval = Approval::with('user.divisions')->where('document_id', $id)->where('document_name', 'PR')->orderBy('id', 'ASC')->get();
        return $this->successResponse([
            'data' => $procurement,
            'approval' => $approval
        ]);
    }
    public function retryPr($id, $type)
    {
        SapJobs::dispatch($id, $type);


        return $this->successResponse();
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('purchaserequisition::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RequestsProcurement $request, $id)
    {
        //
        DB::beginTransaction();
        try {
            //code...
            // Find the purchase by ID
            $purchase = Purchase::with('vendors.units')->findOrFail($id);

            $purchase->entertainment()->updateOrCreate([
                'purchase_id' => $id
            ], $request['entertainment']);


            if ($request->has('attachment') && is_array($request->attachment) && count($request->attachment) > 0) {
                foreach ($request->attachment as $key => $value) {
                    # code...
                    $path = $this->saveBase64Image($value['file_path'], 'purchaserequisition');
                    $purchase->attachment()->updateOrCreate(
                        [
                            'file_path' => ltrim($path, '/'),
                            'purchase_id' => $id,
                        ],
                        [
                            'file_name' => $value['file_name'],
                            'file_path' => ltrim($path, '/'),
                        ]
                    );
                }
            }


            $this->logToDatabase(
                $purchase->id,
                'procurement',
                'INFO',
                'Procurement Di Update Oleh User ' . Auth::user()->name . ' Pada Tanggal ' . $this->DateTimeNow(),
                $request->all()
            );



            DB::commit();
            return $this->successResponse($request->all());
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return $this->errorResponse($th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $procurement = Purchase::findOrFail($id);
        $procurement->delete();

        return $this->successResponse($procurement);
    }
}
