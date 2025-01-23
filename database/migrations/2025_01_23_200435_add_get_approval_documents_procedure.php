<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        DB::unprepared('
          CREATE OR REPLACE FUNCTION public.get_approval_documents(
    user_id_param integer,
    doc_name character varying,
    doc_status character varying
)
RETURNS TABLE(document_id character varying)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT a.document_id
    FROM approvals a
    LEFT JOIN (
        SELECT
            MIN(a2.user_id) AS min_user_id,
            a2.document_id
        FROM approvals a2
        WHERE a2.document_name = doc_name
            AND a2.status = doc_status
        GROUP BY a2.document_id
    ) AS approvalUser
    ON approvalUser.document_id = a.document_id
    WHERE a.document_name = doc_name
        AND a.status = doc_status
        AND a.user_id = user_id_param
        AND approvalUser.min_user_id = a.user_id;
END;
$function$;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        DB::unprepared('DROP PROCEDURE IF EXISTS get_approval_documents');
    }
};
