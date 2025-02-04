<?php

namespace App\Http\Controllers;

use Clue\Redis\Protocol\Model\Request;
use DateTime;
use DateTimeZone;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Modules\Approval\Models\Approval;
use Modules\Gateway\Models\Log;
use Illuminate\Support\Facades\File;
use Modules\PurchaseRequisition\Models\PurchaseRequisition;
use Modules\PurchaseRequisition\Services\BtPOService;
use Modules\PurchaseRequisition\Services\BtService;
use Modules\PurchaseRequisition\Services\ProcurementService;
use Modules\PurchaseRequisition\Services\ReimburseServices;
use Modules\PurchaseRequisition\Services\TextPoServices;
use Modules\PurchaseRequisition\Services\TextPrServices;

abstract class Controller
{
    //
    /**
     * Default JSON response for success.
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function successResponse($data = null, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'status_code' => $statusCode,
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    /**
     * Default JSON response for error.
     *
     * @param string $message
     * @param int $statusCode
     * @param mixed $errors
     * @return JsonResponse
     */
    protected function errorResponse(string $message = 'Error', int $statusCode = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'status_code' => $statusCode,
            'status' => 'error',
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }

    /**
     * Default JSON response for not found.
     *
     * @param string $message
     * @return JsonResponse
     */
    protected function notFoundResponse(string $message = 'Resource not found'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Filters and paginates a given model based on request parameters.
     *
     * @param \Illuminate\Http\Request $request The HTTP request instance containing filter, sort, and pagination options.
     * @param \Illuminate\Database\Eloquent\Model|\Illuminate\Database\Eloquent\Builder $model The model or query builder to filter and paginate.
     * @param array $filterableColumns An array of column names that can be filtered.
     * @param bool $userData Whether to filter the query based on user data and approvals.
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator A paginator instance containing the paginated results.
     */

    public function filterAndPaginate($request, $model, array $filterableColumns, $userData = false)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');

        $query = $model instanceof \Illuminate\Database\Eloquent\Builder ? $model : $model::query();

        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Menggunakan fungsi helper
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request, $filterableColumns) {
                foreach ($filterableColumns as $column) {
                    $q->orWhere($column, 'ILIKE', '%' . $request->search . '%');
                }
            });
        }

        if ($userData) {
            if ($request->approval == 1) {

                $data = Approval::where('user_id', Auth::user()->id)
                    ->where('document_name', 'PR')
                    ->where('status', 'Waiting')
                    ->where('is_approval', true)
                    ->pluck('document_id')
                    ->toArray();

                $query = $query->whereIn('id', $data);
            } else {
                $query->where(function ($q) use ($request, $filterableColumns) {
                    $q->orWhere('user_id', Auth::user()->id)
                        ->orWhere('createdBy', Auth::user()->id);
                });
            }
        }

        $query->orderBy($sortBy, $sortDirection);
        return $query->paginate($perPage);
    }

    public function filterAndPaginateHasJoin($request, $model, array $filterableColumns, array $hasFilters, $userData = false)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');

        $query = $model instanceof \Illuminate\Database\Eloquent\Builder ? $model : $model::query();

        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Menggunakan fungsi helper
            }

            // Check if the key matches a relationship column in $hasColumns
            foreach ($hasFilters as $relation) {
                $relationshipKey = "{$relation['join']}_{$relation['column']}";

                if ($key === $relationshipKey) {
                    list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);

                    $query->whereHas($relation['join'], function ($q) use ($relation, $operator, $filterValue) {
                        $this->applyColumnFilter($q, $relation['column'], $operator, $filterValue);
                    });
                    break;
                }
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request, $filterableColumns, $hasFilters) {
                foreach ($filterableColumns as $column) {
                    $q->orWhere($column, 'ILIKE', '%' . $request->search . '%');
                }

                foreach ($hasFilters as $hasFilter) {
                    $q->orWhereHas($hasFilter['join'], function ($q) use ($request, $hasFilter) {
                        $q->where($hasFilter['column'], 'ILIKE', '%' . $request->search . '%');
                    });
                }
            });
        }

        if ($userData) {
            if ($request->approval == 1) {

                $data = Approval::where('user_id', Auth::user()->id)
                    ->where('document_name', 'PR')
                    ->where('status', 'Waiting')
                    ->pluck('document_id')
                    ->toArray();
                $query = $query->whereIn('id', $data);
            } else {
                $query->where(function ($q) use ($request, $filterableColumns) {
                    $q->orWhere('user_id', Auth::user()->id)
                        ->orWhere('createdBy', Auth::user()->id);
                });
            }
        }

        $query->orderBy($sortBy, $sortDirection);
        return $query->paginate($perPage);
    }

    public function filterAndNotPaginateHasJoin($request, $model, array $filterableColumns, array $hasFilters, $userData = false)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'desc');

        $query = $model instanceof \Illuminate\Database\Eloquent\Builder ? $model : $model::query();

        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Menggunakan fungsi helper
            }

            // Check if the key matches a relationship column in $hasColumns
            foreach ($hasFilters as $relation) {
                $relationshipKey = "{$relation['join']}_{$relation['column']}";

                if ($key === $relationshipKey) {
                    list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);

                    $query->whereHas($relation['join'], function ($q) use ($relation, $operator, $filterValue) {
                        $this->applyColumnFilter($q, $relation['column'], $operator, $filterValue);
                    });
                    break;
                }
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request, $filterableColumns, $hasFilters) {
                foreach ($filterableColumns as $column) {
                    $q->orWhere($column, 'ILIKE', '%' . $request->search . '%');
                }

                foreach ($hasFilters as $hasFilter) {
                    $q->orWhereHas($hasFilter['join'], function ($q) use ($request, $hasFilter) {
                        $q->where($hasFilter['column'], 'ILIKE', '%' . $request->search . '%');
                    });
                }
            });
        }

        if ($userData) {
            if ($request->approval == 1) {

                $data = Approval::where('user_id', Auth::user()->id)
                    ->where('document_name', 'PR')
                    ->where('status', 'Waiting')
                    ->pluck('document_id')
                    ->toArray();
                $query = $query->whereIn('id', $data);
            } else {
                $query->where(function ($q) use ($request, $filterableColumns) {
                    $q->orWhere('user_id', Auth::user()->id)
                        ->orWhere('createdBy', Auth::user()->id);
                });
            }
        }

        $query->orderBy($sortBy, $sortDirection);
        return $query->get();
    }

    /**
     * Fungsi untuk filtering model tanpa menggunakan pagination.
     *
     * @param \Illuminate\Http\Request $request
     * @param mixed $model
     * @param array $filterableColumns
     * @param boolean $userData
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function filterNotPaggination($request, $model, array $filterableColumns, $userData = false)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort_by', 'id');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = $model instanceof \Illuminate\Database\Eloquent\Builder ? $model : $model::query();

        foreach ($request->all() as $key => $value) {
            if (in_array($key, $filterableColumns)) {
                list($operator, $filterValue) = array_pad(explode(',', $value, 2), 2, null);
                $query = $this->applyColumnFilter($query, $key, $operator, $filterValue); // Menggunakan fungsi helper
            }
        }

        if ($request->search) {
            $query->where(function ($q) use ($request, $filterableColumns) {
                foreach ($filterableColumns as $column) {
                    $q->orWhere($column, 'ILIKE', '%' . $request->search . '%');
                }
            });
        }


        $query->orderBy($sortBy, $sortDirection);
        return $query->get();
    }

    /**
     * Apply a filter to a query based on a specified column, operator, and value.
     *
     * This method modifies the provided query by applying a filter condition
     * on the specified column using the given operator and value. The operator
     * determines the type of condition applied (e.g., equals, contains, etc.).
     *
     * Supported operators include:
     * - 'equals': Filters where the column equals the value.
     * - 'does not equal': Filters where the column is not equal to the value.
     * - 'contains': Filters where the column contains the value.
     * - 'does not contain': Filters where the column does not contain the value.
     * - 'starts with': Filters where the column starts with the value.
     * - 'ends with': Filters where the column ends with the value.
     * - 'is empty': Filters where the column is empty or null.
     * - 'is not empty': Filters where the column is not empty and not null.
     * - 'is any of': Filters where the column matches any of the comma-separated values.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query The query builder instance.
     * @param string $column The name of the column to filter on.
     * @param string $operator The operator to use for filtering.
     * @param mixed $value The value to filter the column by.
     * @return \Illuminate\Database\Eloquent\Builder The modified query builder instance.
     */

    protected function applyColumnFilter($query, $column, $operator, $value)
    {
        switch ($operator) {
            case 'equals':
                return $query->where($column, '=', $value);
            case 'does not equal':
                return $query->where($column, '!=', $value);
            case 'contains':
                return $query->where($column, 'like', "%{$value}%");
            case 'does not contain':
                return $query->where($column, 'not like', "%{$value}%");
            case 'starts with':
                return $query->where($column, 'like', "{$value}%");
            case 'ends with':
                return $query->where($column, 'like', "%{$value}");
            case 'is empty':
                return $query->where(function ($query) use ($column) {
                    $query->where($column, '=', '')
                        ->orWhereNull($column);
                });
            case 'is not empty':
                return $query->where(function ($query) use ($column) {
                    $query->where($column, '!=', '')
                        ->whereNotNull($column);
                });
            case 'is any of':
                // Assumes value is a comma-separated string of options
                $values = explode(',', $value);
                return $query->whereIn($column, $values);
            default:
                // Default fallback (e.g., equals)
                return $query->where($column, '=', $value);
        }
    }


    /**
     * Logs a message to the database.
     *
     * The message is associated with the provided ID, function name, and level.
     * Additional context is stored as JSON.
     *
     * @param int $id The ID of the related item (e.g., a business trip ID).
     * @param string $functionName The function name that triggered the log entry.
     * @param string $level The log level (e.g., 'info', 'warning', 'error').
     * @param string $message The log message.
     * @param array $context Additional context to store with the log entry.
     */
    protected function logToDatabase($id, $functionName, $level, $message, $context = [])
    {
        Log::create([
            'releted_id' => $id,
            'function_name' => $functionName,
            'level' => $level,
            'message' => $message,
            'context' => json_encode($context), // Store additional context as JSON
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
    /**
     * Get the current date time with timezone Asia/Jakarta.
     *
     * @return string
     */
    protected function DateTimeNow()
    {
        $date = new DateTime('now', new DateTimeZone('Asia/Jakarta'));
        return $date->format('Y-m-d H:i:s');
    }


    /**
     * Saves a base64 image to a file.
     *
     * @param string $base64Image The base64 image string.
     * @param string $directory The directory where the image will be saved (default: 'images').
     * @return string The path to the saved image.
     * @throws \Exception If the base64 image string is invalid, or if the image fails to save.
     */
    function saveBase64Image(string $base64File, string $directory = 'images')
    {
        try {
            // Cek apakah input adalah path file
            $baseUrl = env('APP_URL');
            $filePathWithoutBaseUrl = str_replace($baseUrl, '', $base64File);
            if (File::exists(ltrim($filePathWithoutBaseUrl, '/'))) {
                return $filePathWithoutBaseUrl; // Jika file path valid, langsung kembalikan path
            }

            if (preg_match('/^data:([a-zA-Z0-9\/\+\.\-]+);base64,/', $base64File, $matches)) {
                $mimeType = $matches[1];
                $base64File = substr($base64File, strpos($base64File, ',') + 1);
                $base64File = base64_decode($base64File);

                if ($base64File === false) {
                    throw new \Exception('Invalid Base64 string.');
                }

                // Determine file extension from MIME type
                $extension = explode('/', $mimeType)[1];
                if ($extension == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    $extension = 'xlsx';
                } elseif ($extension == 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    $extension = 'docx';
                } elseif ($extension == 'plain') {
                    $extension = 'txt';
                }

                // Tentukan path direktori tujuan
                $fullDirectory = public_path($directory);

                // Buat direktori jika belum ada
                if (!File::exists($fullDirectory)) {
                    File::makeDirectory($fullDirectory, 0755, true);
                }

                // Nama file
                $fileName = time() . '_' . uniqid() . '.' . $extension;

                // Simpan file
                $filePath = $fullDirectory . '/' . $fileName;
                if (!file_put_contents($filePath, $base64File)) {
                    throw new \Exception('Failed to save file.');
                }

                return $directory . '/' . $fileName;
            } else {
                throw new \Exception('Please Check Your Attachment Format');
            }
        } catch (\Exception $e) {
            throw new \Exception('Error processing image: ' . $e->getMessage());
        }
    }

    function IncrementTotalData($tabelName)
    {
        $totalRows = DB::table($tabelName)->count();
        $newValue = str_pad($totalRows + 1, 8, '0', STR_PAD_LEFT);

        return $newValue;
    }

    function handlesendText($id, $type)
    {
        // Instantiate services within the job
        $reim = new ReimburseServices();
        $bt = new BtService();
        $btpo = new BtPOService();
        $procurement = new ProcurementService();
        $txtpr = new TextPrServices();
        $txtpo = new TextPoServices();

        // Switch case to handle different types
        switch ($type) {
            case 'REIM':
                $reim->processTextData($id);
                $txtpr->processTextData($id, 'REIM');

                break;

            case 'BT':
                $bt->processTextData($id);
                $txtpr->processTextData($id, 'BTRE');
                break;

            case 'BTPO':
                $btpo->processTextData($id);
                $txtpo->processTextData($id, 'BTRDE');

                break;

            case 'PR':
                $procurement->processTextData($id);
                $txtpr->processTextData($id, 'VEN');
                break;

            default:
                // Handle unknown type case
                break;
        }
    }
}
