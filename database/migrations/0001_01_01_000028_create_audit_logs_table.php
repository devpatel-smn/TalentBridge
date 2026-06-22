<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('audit_logs', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();
      $table->string('auditable_type', 100);
      $table->unsignedBigInteger('auditable_id');
      $table->jsonb('old_values')->nullable();
      $table->jsonb('new_values')->nullable();
      $table->text('user_agent')->nullable();
      $table->timestamp('created_at');

      $table->index(['auditable_type', 'auditable_id']);
      $table->index('created_at');
    });

    DB::statement('ALTER TABLE audit_logs ADD COLUMN action audit_action NOT NULL');
    DB::statement('ALTER TABLE audit_logs ADD COLUMN ip_address inet NULL');
    DB::statement('CREATE INDEX audit_logs_action_index ON audit_logs (action)');
  }

  public function down(): void
  {
    Schema::dropIfExists('audit_logs');
  }
};
