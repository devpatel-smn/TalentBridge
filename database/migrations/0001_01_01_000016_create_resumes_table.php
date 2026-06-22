<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('resumes', function (Blueprint $table) {
      $table->id();
      $table->uuid('uuid')->unique();
      $table->foreignId('job_seeker_profile_id')
        ->constrained('job_seeker_profiles')
        ->cascadeOnDelete();
      $table->string('title', 255);
      $table->string('template_key', 50)->default('classic');
      $table->boolean('is_primary')->default(false);
      $table->string('source', 20);
      $table->foreignId('file_id')
        ->nullable()
        ->constrained('files')
        ->nullOnDelete();
      $table->jsonb('metadata')->nullable();
      $table->timestamps();
      $table->softDeletes();

      $table->index('job_seeker_profile_id');
      $table->index('is_primary');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('resumes');
  }
};
