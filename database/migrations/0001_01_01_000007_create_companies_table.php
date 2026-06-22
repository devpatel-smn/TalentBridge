<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('companies', function (Blueprint $table) {
      $table->id();
      $table->uuid('uuid')->unique();
      $table->string('name', 255);
      $table->string('slug', 255)->unique();
      $table->text('description')->nullable();
      $table->string('website', 255)->nullable();
      $table->string('industry', 100)->nullable();
      $table->string('company_size', 50)->nullable();
      $table->unsignedSmallInteger('founded_year')->nullable();
      $table->string('headquarters', 255)->nullable();
      $table->foreignId('logo_file_id')
        ->nullable()
        ->constrained('files')
        ->nullOnDelete();
      $table->timestamp('verified_at')->nullable();
      $table->foreignId('verified_by')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();
      $table->jsonb('social_links')->nullable();
      $table->jsonb('settings')->nullable();
      $table->foreignId('created_by')
        ->constrained('users')
        ->restrictOnDelete();
      $table->foreignId('updated_by')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();
      $table->timestamps();
      $table->softDeletes();

      $table->index('industry');
      $table->index('deleted_at');
    });

    DB::statement("ALTER TABLE companies ADD COLUMN verification_status verification_status NOT NULL DEFAULT 'pending'");
    DB::statement('CREATE INDEX companies_verification_status_index ON companies (verification_status)');
  }

  public function down(): void
  {
    Schema::dropIfExists('companies');
  }
};
