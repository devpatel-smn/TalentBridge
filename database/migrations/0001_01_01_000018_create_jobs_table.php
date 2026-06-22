<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('jobs', function (Blueprint $table) {
      $table->id();
      $table->uuid('uuid')->unique();
      $table->foreignId('company_id')
        ->constrained('companies')
        ->restrictOnDelete();
      $table->foreignId('category_id')
        ->nullable()
        ->constrained('job_categories')
        ->nullOnDelete();
      $table->string('title', 255);
      $table->string('slug', 255);
      $table->text('description');
      $table->text('requirements')->nullable();
      $table->text('responsibilities')->nullable();
      $table->text('benefits')->nullable();
      $table->string('experience_level', 50)->nullable();
      $table->decimal('salary_min', 12, 2)->nullable();
      $table->decimal('salary_max', 12, 2)->nullable();
      $table->string('salary_currency', 3)->default('USD');
      $table->string('salary_period', 20)->default('yearly');
      $table->boolean('is_salary_visible')->default(false);
      $table->string('location_city', 100)->nullable();
      $table->string('location_state', 100)->nullable();
      $table->string('location_country', 100)->nullable();
      $table->date('application_deadline')->nullable();
      $table->unsignedSmallInteger('vacancies')->default(1);
      $table->timestamp('published_at')->nullable();
      $table->timestamp('closed_at')->nullable();
      $table->unsignedInteger('views_count')->default(0);
      $table->unsignedInteger('applications_count')->default(0);
      $table->foreignId('created_by')
        ->constrained('users')
        ->restrictOnDelete();
      $table->foreignId('updated_by')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();
      $table->timestamps();
      $table->softDeletes();

      $table->index('company_id');
      $table->index('slug');
      $table->index('published_at');
    });

    DB::statement("ALTER TABLE jobs ADD COLUMN employment_type employment_type NOT NULL");
    DB::statement("ALTER TABLE jobs ADD COLUMN work_mode work_mode NOT NULL");
    DB::statement("ALTER TABLE jobs ADD COLUMN status job_status NOT NULL DEFAULT 'draft'");
    DB::statement('CREATE INDEX jobs_status_index ON jobs (status)');
    DB::statement('CREATE INDEX jobs_employment_type_index ON jobs (employment_type)');
    DB::statement('CREATE INDEX jobs_work_mode_index ON jobs (work_mode)');
    DB::statement('CREATE INDEX jobs_location_country_status_index ON jobs (location_country, status)');

    DB::statement("
      CREATE INDEX jobs_fts_idx ON jobs
      USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(requirements, '')))
    ");
  }

  public function down(): void
  {
    Schema::dropIfExists('jobs');
  }
};
