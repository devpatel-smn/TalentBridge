<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('employer_users', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')
        ->constrained('users')
        ->cascadeOnDelete();
      $table->foreignId('company_id')
        ->constrained('companies')
        ->cascadeOnDelete();
      $table->string('job_title', 100)->nullable();
      $table->boolean('is_primary')->default(false);
      $table->boolean('is_active')->default(true);
      $table->foreignId('invited_by')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();
      $table->timestamp('joined_at')->nullable();
      $table->timestamps();
      $table->softDeletes();

      $table->unique(['company_id', 'user_id']);
      $table->index('is_active');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('employer_users');
  }
};
