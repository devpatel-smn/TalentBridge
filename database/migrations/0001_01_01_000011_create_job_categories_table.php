<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('job_categories', function (Blueprint $table) {
      $table->id();
      $table->string('name', 100)->unique();
      $table->string('slug', 100)->unique();
      $table->foreignId('parent_id')
        ->nullable()
        ->constrained('job_categories')
        ->nullOnDelete();
      $table->unsignedSmallInteger('sort_order')->default(0);
      $table->boolean('is_active')->default(true);
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('job_categories');
  }
};
