<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('notification_preferences', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')
        ->constrained('users')
        ->cascadeOnDelete();
      $table->boolean('channel_mail')->default(true);
      $table->boolean('channel_database')->default(true);
      $table->boolean('channel_push')->default(false);
      $table->timestamps();
    });

    DB::statement('ALTER TABLE notification_preferences ADD COLUMN notification_type notification_type NOT NULL');
    DB::statement('CREATE UNIQUE INDEX notification_preferences_user_id_notification_type_unique ON notification_preferences (user_id, notification_type)');
  }

  public function down(): void
  {
    Schema::dropIfExists('notification_preferences');
  }
};
