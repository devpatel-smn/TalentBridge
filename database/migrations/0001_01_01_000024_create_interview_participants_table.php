<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('interview_participants', function (Blueprint $table) {
      $table->id();
      $table->foreignId('interview_id')
        ->constrained('interviews')
        ->cascadeOnDelete();
      $table->foreignId('user_id')
        ->constrained('users')
        ->cascadeOnDelete();
      $table->string('role', 50);
      $table->string('response_status', 20)->default('pending');
      $table->timestamps();

      $table->unique(['interview_id', 'user_id']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('interview_participants');
  }
};
