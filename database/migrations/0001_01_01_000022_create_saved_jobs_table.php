<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('saved_jobs', function (Blueprint $table) {
      $table->id();
      $table->foreignId('job_seeker_profile_id')
        ->constrained('job_seeker_profiles')
        ->cascadeOnDelete();
      $table->foreignId('job_id')
        ->constrained('jobs')
        ->cascadeOnDelete();
      $table->timestamp('created_at')->nullable();

      $table->unique(['job_seeker_profile_id', 'job_id']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('saved_jobs');
  }
};
