<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('job_recommendations', function (Blueprint $table) {
      $table->id();
      $table->foreignId('job_seeker_profile_id')
        ->constrained('job_seeker_profiles')
        ->cascadeOnDelete();
      $table->foreignId('job_id')
        ->constrained('jobs')
        ->cascadeOnDelete();
      $table->decimal('score', 5, 2);
      $table->jsonb('reason')->nullable();
      $table->boolean('is_dismissed')->default(false);
      $table->boolean('is_viewed')->default(false);
      $table->timestamp('generated_at');
      $table->timestamp('expires_at')->nullable();
      $table->timestamps();

      $table->unique(['job_seeker_profile_id', 'job_id']);
      $table->index('generated_at');
    });

    DB::statement('CREATE INDEX job_recommendations_score_index ON job_recommendations (score DESC)');
  }

  public function down(): void
  {
    Schema::dropIfExists('job_recommendations');
  }
};
