<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('interviews', function (Blueprint $table) {
      $table->id();
      $table->uuid('uuid')->unique();
      $table->foreignId('job_application_id')
        ->constrained('job_applications')
        ->cascadeOnDelete();
      $table->foreignId('company_id')
        ->constrained('companies')
        ->cascadeOnDelete();
      $table->foreignId('scheduled_by')
        ->constrained('users')
        ->restrictOnDelete();
      $table->string('title', 255)->nullable();
      $table->timestamp('scheduled_at');
      $table->unsignedSmallInteger('duration_minutes')->default(60);
      $table->string('timezone', 50);
      $table->string('location', 255)->nullable();
      $table->string('meeting_link', 500)->nullable();
      $table->text('instructions')->nullable();
      $table->text('feedback')->nullable();
      $table->unsignedSmallInteger('rating')->nullable();
      $table->timestamp('completed_at')->nullable();
      $table->timestamp('cancelled_at')->nullable();
      $table->text('cancellation_reason')->nullable();
      $table->timestamps();
      $table->softDeletes();

      $table->index('job_application_id');
      $table->index('company_id');
      $table->index('scheduled_at');
    });

    DB::statement('ALTER TABLE interviews ADD COLUMN interview_type interview_type NOT NULL');
    DB::statement("ALTER TABLE interviews ADD COLUMN status interview_status NOT NULL DEFAULT 'scheduled'");
    DB::statement('CREATE INDEX interviews_status_index ON interviews (status)');
  }

  public function down(): void
  {
    Schema::dropIfExists('interviews');
  }
};
