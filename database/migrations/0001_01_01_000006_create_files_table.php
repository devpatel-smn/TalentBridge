<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('files', function (Blueprint $table) {
      $table->id();
      $table->uuid('uuid')->unique();
      $table->foreignId('uploaded_by')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();
      $table->string('disk', 50)->default('s3');
      $table->string('path', 500);
      $table->string('original_name', 255);
      $table->string('mime_type', 100);
      $table->unsignedBigInteger('size_bytes');
      $table->string('entity_type', 100)->nullable();
      $table->unsignedBigInteger('entity_id')->nullable();
      $table->string('checksum', 64)->nullable();
      $table->jsonb('metadata')->nullable();
      $table->timestamps();
      $table->softDeletes();

      $table->index(['entity_type', 'entity_id']);
    });

    DB::statement("ALTER TABLE files ADD COLUMN file_type file_type NOT NULL");
    DB::statement('CREATE INDEX files_file_type_index ON files (file_type)');

    Schema::table('users', function (Blueprint $table) {
      $table->foreign('avatar_file_id')
        ->references('id')
        ->on('files')
        ->nullOnDelete();
    });
  }

  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->dropForeign(['avatar_file_id']);
    });

    Schema::dropIfExists('files');
  }
};
