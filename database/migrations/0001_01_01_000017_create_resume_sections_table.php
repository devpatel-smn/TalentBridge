<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('resume_sections', function (Blueprint $table) {
      $table->id();
      $table->foreignId('resume_id')
        ->constrained('resumes')
        ->cascadeOnDelete();
      $table->string('section_type', 50);
      $table->string('title', 150)->nullable();
      $table->jsonb('content');
      $table->unsignedSmallInteger('sort_order')->default(0);
      $table->boolean('is_visible')->default(true);
      $table->timestamps();

      $table->index('resume_id');
      $table->index(['resume_id', 'sort_order']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('resume_sections');
  }
};
