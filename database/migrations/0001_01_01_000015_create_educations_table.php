<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('educations', function (Blueprint $table) {
      $table->id();
      $table->foreignId('job_seeker_profile_id')
        ->constrained('job_seeker_profiles')
        ->cascadeOnDelete();
      $table->string('institution', 255);
      $table->string('degree', 150);
      $table->string('field_of_study', 150)->nullable();
      $table->string('grade', 50)->nullable();
      $table->text('description')->nullable();
      $table->date('started_at')->nullable();
      $table->date('ended_at')->nullable();
      $table->boolean('is_current')->default(false);
      $table->unsignedSmallInteger('sort_order')->default(0);
      $table->timestamps();
      $table->softDeletes();

      $table->index('job_seeker_profile_id');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('educations');
  }
};
