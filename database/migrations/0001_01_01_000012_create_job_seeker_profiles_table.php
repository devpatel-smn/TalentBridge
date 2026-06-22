<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('job_seeker_profiles', function (Blueprint $table) {
      $table->id();
      $table->uuid('uuid')->unique();
      $table->foreignId('user_id')
        ->unique()
        ->constrained('users')
        ->cascadeOnDelete();
      $table->string('headline', 255)->nullable();
      $table->text('summary')->nullable();
      $table->string('current_title', 150)->nullable();
      $table->decimal('years_of_experience', 4, 1)->nullable();
      $table->decimal('expected_salary_min', 12, 2)->nullable();
      $table->decimal('expected_salary_max', 12, 2)->nullable();
      $table->string('salary_currency', 3)->default('USD');
      $table->boolean('willing_to_relocate')->default(false);
      $table->string('location_city', 100)->nullable();
      $table->string('location_state', 100)->nullable();
      $table->string('location_country', 100)->nullable();
      $table->string('linkedin_url', 255)->nullable();
      $table->string('portfolio_url', 255)->nullable();
      $table->unsignedSmallInteger('profile_completion')->default(0);
      $table->boolean('is_open_to_work')->default(true);
      $table->boolean('is_profile_public')->default(true);
      $table->foreignId('resume_file_id')
        ->nullable()
        ->constrained('files')
        ->nullOnDelete();
      $table->timestamps();
      $table->softDeletes();

      $table->index('is_open_to_work');
      $table->index('location_country');
      $table->index('profile_completion');
    });

    DB::statement('ALTER TABLE job_seeker_profiles ADD COLUMN preferred_work_mode work_mode NULL');
    DB::statement('ALTER TABLE job_seeker_profiles ADD COLUMN preferred_employment_type employment_type NULL');

    DB::statement("
      CREATE INDEX job_seeker_profiles_fts_idx ON job_seeker_profiles
      USING GIN (to_tsvector('english', coalesce(headline, '') || ' ' || coalesce(summary, '')))
    ");
  }

  public function down(): void
  {
    Schema::dropIfExists('job_seeker_profiles');
  }
};
