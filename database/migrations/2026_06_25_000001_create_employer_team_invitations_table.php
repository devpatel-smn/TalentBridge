<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employer_team_invitations', function (Blueprint $table) {
            $table->id();
            $table->string('email', 255);
            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnDelete();
            $table->foreignId('employer_user_id')
                ->constrained('employer_users')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('job_title', 100)->nullable();
            $table->boolean('is_primary')->default(false);
            $table->foreignId('invited_by')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('token', 255);
            $table->timestamp('expires_at');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();

            $table->index(['email', 'company_id']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employer_team_invitations');
    }
};
