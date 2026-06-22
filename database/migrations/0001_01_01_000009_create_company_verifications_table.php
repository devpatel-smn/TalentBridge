<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('company_verifications', function (Blueprint $table) {
      $table->id();
      $table->foreignId('company_id')
        ->constrained('companies')
        ->cascadeOnDelete();
      $table->foreignId('submitted_by')
        ->constrained('users')
        ->restrictOnDelete();
      $table->string('business_registration_number', 100)->nullable();
      $table->string('tax_id', 100)->nullable();
      $table->jsonb('documents')->nullable();
      $table->text('notes')->nullable();
      $table->foreignId('reviewer_id')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();
      $table->text('reviewer_notes')->nullable();
      $table->text('rejection_reason')->nullable();
      $table->timestamp('reviewed_at')->nullable();
      $table->timestamps();

      $table->index('company_id');
      $table->index('submitted_by');
    });

    DB::statement("ALTER TABLE company_verifications ADD COLUMN status verification_status NOT NULL DEFAULT 'pending'");
    DB::statement('CREATE INDEX company_verifications_status_index ON company_verifications (status)');
  }

  public function down(): void
  {
    Schema::dropIfExists('company_verifications');
  }
};
