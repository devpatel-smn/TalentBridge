<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('experiences', function (Blueprint $table) {
      $table->id();
      $table->foreignId('job_seeker_profile_id')
        ->constrained('job_seeker_profiles')
        ->cascadeOnDelete();
      $table->string('company_name', 255);
      $table->string('job_title', 150);
      $table->string('location', 255)->nullable();
      $table->text('description')->nullable();
      $table->date('started_at');
      $table->date('ended_at')->nullable();
      $table->boolean('is_current')->default(false);
      $table->unsignedSmallInteger('sort_order')->default(0);
      $table->timestamps();
      $table->softDeletes();

      $table->index('job_seeker_profile_id');
      $table->index('is_current');
    });

    DB::statement('ALTER TABLE experiences ADD COLUMN employment_type employment_type NULL');
  }

  public function down(): void
  {
    Schema::dropIfExists('experiences');
  }
};
