<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interview_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('interview_id')
                ->constrained('interviews')
                ->cascadeOnDelete();
            $table->foreignId('changed_by')
                ->constrained('users')
                ->restrictOnDelete();
            $table->text('notes')->nullable();
            $table->timestamp('created_at');

            $table->index('interview_id');
            $table->index('created_at');
        });

        DB::statement('ALTER TABLE interview_status_histories ADD COLUMN from_status interview_status NULL');
        DB::statement('ALTER TABLE interview_status_histories ADD COLUMN to_status interview_status NOT NULL');
    }

    public function down(): void
    {
        Schema::dropIfExists('interview_status_histories');
    }
};
