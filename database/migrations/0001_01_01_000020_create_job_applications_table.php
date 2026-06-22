<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('job_applications', function (Blueprint $table) {
      $table->id();
      $table->uuid('uuid')->unique();
      $table->foreignId('job_id')
        ->constrained('jobs')
        ->restrictOnDelete();
      $table->foreignId('job_seeker_profile_id')
        ->constrained('job_seeker_profiles')
        ->restrictOnDelete();
      $table->foreignId('resume_id')
        ->nullable()
        ->constrained('resumes')
        ->nullOnDelete();
      $table->text('cover_letter')->nullable();
      $table->text('employer_notes')->nullable();
      $table->text('rejection_reason')->nullable();
      $table->timestamp('applied_at');
      $table->timestamp('status_changed_at')->nullable();
      $table->timestamps();
      $table->softDeletes();

      $table->unique(['job_id', 'job_seeker_profile_id']);
      $table->index('applied_at');
      $table->index('job_seeker_profile_id');
    });

    DB::statement("ALTER TABLE job_applications ADD COLUMN status application_status NOT NULL DEFAULT 'submitted'");
    DB::statement('CREATE INDEX job_applications_status_index ON job_applications (status)');
  }

  public function down(): void
  {
    Schema::dropIfExists('job_applications');
  }
};
