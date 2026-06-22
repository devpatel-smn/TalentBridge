<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('users', function (Blueprint $table) {
      $table->id();
      $table->uuid('uuid')->unique();
      $table->string('first_name', 100);
      $table->string('last_name', 100);
      $table->string('email', 255)->unique();
      $table->timestamp('email_verified_at')->nullable();
      $table->string('password', 255);
      $table->string('phone', 20)->nullable();
      $table->unsignedBigInteger('avatar_file_id')->nullable();
      $table->string('timezone', 50)->default('UTC');
      $table->string('locale', 10)->default('en');
      $table->rememberToken();
      $table->timestamp('last_login_at')->nullable();
      $table->timestamps();
      $table->softDeletes();

      $table->index('deleted_at');
    });

    DB::statement("ALTER TABLE users ADD COLUMN status user_status NOT NULL DEFAULT 'pending_verification'");
    DB::statement('ALTER TABLE users ADD COLUMN last_login_ip inet NULL');
    DB::statement('CREATE INDEX users_status_index ON users (status)');
  }

  public function down(): void
  {
    Schema::dropIfExists('users');
  }
};
