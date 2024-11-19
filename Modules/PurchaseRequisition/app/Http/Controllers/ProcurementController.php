<?php

namespace Modules\PurchaseRequisition\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Jobs\SapJobs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\PurchaseRequisition\Http\Requests\Procurement as RequestsProcurement;
use Modules\PurchaseRequisition\Models\Item;
use Modules\PurchaseRequisition\Models\Procurement;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\PurchaseRequisition\Models\Vendor;
use Modules\PurchaseRequisition\Models\VendorUnit;

class ProcurementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filterableColumns = [
            'user_id',
            'document_type',
            'purchasing_groups',
            'account_assignment_categories',
            'delivery_date',
            'storage_locations',
            'total_vendor',
            'total_item',
        ];
        $data = $this->filterAndPaginate($request, Purchase::class, $filterableColumns);
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
            $purchase = Purchase::create($dataInsert);

            if ($request['entertainment']) {
                $entertain = $purchase->entertainment()->create($request['entertainment']);
            }

            foreach ($request['vendors'] as $vendorData) {
                $vendor = $purchase->vendors()->create(['vendor' => $vendorData['vendor'],  'winner' => $vendorData['winner'] ?? false]);
                foreach ($vendorData['units'] as $unitData) {
                    $unitCrate =  $vendor->units()->create($unitData);
                    if ($unitData['is_cashAdvance']) {
                        $purchase->cashAdvancePurchases()->create([
                            'unit_id' => $unitCrate->id,
                            'reference' => $unitData['reference'],
                            'document_header_text' => $unitData['document_header_text'],
                            'document_date' => $unitData['document_date'],
                            'due_on' => $unitData['due_on'],
                            'text' => $unitData['text'],
                            'dp' => $unitData['dp'],
                        ]);
                    }
                }
            }
            DB::commit();
            SapJobs::dispatch($purchase->id, 'PR');

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
        $procurement = Purchase::with('vendors.units', 'entertainment', 'cashAdvancePurchases')->findOrFail($id);
        return response()->json($procurement);
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

            // Update the purchase fields
            $purchase->update($request->only([
                'user_id',
                'document_type',
                'purchasing_groups',
                'account_assignment_categories',
                'delivery_date',
                'storage_locations',
                'total_vendor',
                'total_item',
                'is_cashAdvance'
            ]));

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
                        ['material_number' => $unitData['material_number']],  // Check for existing unit by material number
                        $unitData  // Update or create with the new data
                    );
                }
            }

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
