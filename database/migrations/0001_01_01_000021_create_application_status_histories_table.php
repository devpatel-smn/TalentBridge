<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('application_status_histories', function (Blueprint $table) {
      $table->id();
      $table->foreignId('job_application_id')
        ->constrained('job_applications')
        ->cascadeOnDelete();
      $table->foreignId('changed_by')
        ->constrained('users')
        ->restrictOnDelete();
      $table->text('notes')->nullable();
      $table->timestamp('created_at');

      $table->index('job_application_id');
      $table->index('created_at');
    });

    DB::statement('ALTER TABLE application_status_histories ADD COLUMN from_status application_status NULL');
    DB::statement('ALTER TABLE application_status_histories ADD COLUMN to_status application_status NOT NULL');
  }

  public function down(): void
  {
    Schema::dropIfExists('application_status_histories');
  }
};
