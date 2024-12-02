<?php

namespace Modules\PurchaseRequisition\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\SapJobs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            $purchase = Purchase::create($dataInsert);

            if ($request['entertainment']) {
                $entertain = $purchase->entertainment()->create($request['entertainment']);
            }

            foreach ($request['vendors'] as $vendorData) {
                $vendor = $purchase->vendors()->create(['vendor' => $vendorData['vendor'],  'winner' => $vendorData['winner'] ?? false]);
                foreach ($vendorData['units'] as $unitData) {
                    $unitCrate =  $vendor->units()->create($unitData);
                    if ($unitData['is_cashAdvance'] ?? false) {
                        $purchase->cashAdvancePurchases()->create([
                            'unit_id' => $unitCrate->id,
                            'reference' => $unitData['cash_advance_purchases']['reference'] ?? '',
                            'document_header_text' => $unitData['cash_advance_purchases']['document_header_text'] ?? '',
                            'document_date' => $unitData['cash_advance_purchases']['document_date'] ?? '',
                            'due_on' => $unitData['cash_advance_purchases']['due_on'] ?? '',
                            'text' => $unitData['cash_advance_purchases']['text'] ?? '',
                            'dp' => $unitData['cash_advance_purchases']['dp'] ?? '',
                        ]);
                    }
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
            //throw $th;
            DB::rollBack();
            return $this->errorResponse($th->getMessage());
        }
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        $procurement = Purchase::with('vendors.units.cashAdvancePurchases', 'entertainment', 'cashAdvancePurchases')->findOrFail($id);
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

            $insert = $request->only([
                'user_id',
                'document_type',
                'purchasing_groups',
                'account_assignment_categories',
                'delivery_date',
                'storage_locations',
                'total_vendor',
                'total_item',
                'is_cashAdvance'
            ]);
            $insert['updatedBy'] = Auth::user()->id;

            // Update the purchase fields
            $purchase->update($insert);

            $entertain = $purchase->entertainment()->updateOrCreate([
                'purchase_id' => $id
            ], $request['entertainment']);

            if ($request->is_cashAdvance) {
                $update = $purchase->cashAdvancePurchases()->updateOrCreate([
                    'purchase_id' => $id
                ], $request['cash_advance_purchases']);
            }

            // Update vendors and units
            foreach ($request['vendors'] as $vendorData) {
                // Check if the vendor exists, if not create it
                $vendor = $purchase->vendors()->updateOrCreate(
                    ['vendor' => $vendorData['vendor']],  // Check for existing vendor
                    ['winner' => $vendorData['winner']]  // No additional fields to update
                );

                // Update or create units for the vendor
                foreach ($vendorData['units'] as $unitData) {
                    $vendor->units()->updateOrCreate(
                        ['id' => $unitData['id']],  // Check for existing unit by material number
                        $unitData  // Update or create with the new data
                    );

                    CashAdvancePurchases::updateOrCreate(
                        [
                            'unit_id' => $unitData['id'],
                            'purchase_id' => $id,
                        ],
                        [
                            'purchase_id' => $id,
                            'unit_id' => $unitData['id'],
                            'reference' => $unitData['cash_advance_purchases']['reference'] ?? '',
                            'document_header_text' => $unitData['cash_advance_purchases']['document_header_text'] ?? '',
                            'document_date' => $unitData['cash_advance_purchases']['document_date'] ?? '',
                            'due_on' => $unitData['cash_advance_purchases']['due_on'] ?? '',
                            'text' => $unitData['cash_advance_purchases']['text'] ?? '',
                            'dp' => $unitData['cash_advance_purchases']['dp'] ?? '',
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
