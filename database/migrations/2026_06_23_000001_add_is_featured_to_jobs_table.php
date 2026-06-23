<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('status');
            $table->index(['is_featured', 'status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropIndex(['is_featured', 'status', 'published_at']);
            $table->dropColumn('is_featured');
        });
    }
};
