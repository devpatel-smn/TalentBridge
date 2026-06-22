<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('activity_logs', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();
      $table->foreignId('company_id')
        ->nullable()
        ->constrained('companies')
        ->nullOnDelete();
      $table->string('activity_type', 100);
      $table->text('description');
      $table->string('subject_type', 100)->nullable();
      $table->unsignedBigInteger('subject_id')->nullable();
      $table->jsonb('properties')->nullable();
      $table->timestamp('created_at');

      $table->index('user_id');
      $table->index('company_id');
      $table->index('activity_type');
      $table->index('created_at');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('activity_logs');
  }
};
