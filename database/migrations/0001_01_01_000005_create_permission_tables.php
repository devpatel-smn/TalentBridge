<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    $teams = config('permission.teams', false);
    $tableNames = config('permission.table_names', [
      'roles' => 'roles',
      'permissions' => 'permissions',
      'model_has_permissions' => 'model_has_permissions',
      'model_has_roles' => 'model_has_roles',
      'role_has_permissions' => 'role_has_permissions',
    ]);
    $columnNames = config('permission.column_names', [
      'model_morph_key' => 'model_id',
      'team_foreign_key' => 'team_id',
    ]);
    $pivotRole = $columnNames['team_foreign_key'] ?? 'team_id';

    Schema::create($tableNames['permissions'], function (Blueprint $table) {
      $table->id();
      $table->string('name', 255);
      $table->string('guard_name', 255)->default('web');
      $table->timestamps();

      $table->unique(['name', 'guard_name']);
    });

    Schema::create($tableNames['roles'], function (Blueprint $table) use ($teams, $pivotRole) {
      $table->id();
      if ($teams) {
        $table->unsignedBigInteger($pivotRole)->nullable();
        $table->index($pivotRole);
      }
      $table->string('name', 255);
      $table->string('guard_name', 255)->default('web');
      $table->timestamps();

      if ($teams) {
        $table->unique([$pivotRole, 'name', 'guard_name']);
      } else {
        $table->unique(['name', 'guard_name']);
      }
    });

    Schema::create($tableNames['model_has_permissions'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotRole, $teams) {
      $table->unsignedBigInteger('permission_id');

      $table->string('model_type', 255);
      $table->unsignedBigInteger($columnNames['model_morph_key']);
      $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_model_id_model_type_index');

      $table->foreign('permission_id')
        ->references('id')
        ->on($tableNames['permissions'])
        ->cascadeOnDelete();

      if ($teams) {
        $table->unsignedBigInteger($pivotRole);
        $table->index($pivotRole, 'model_has_permissions_team_foreign_key_index');
        $table->primary([$pivotRole, 'permission_id', $columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_permission_model_type_primary');
      } else {
        $table->primary(['permission_id', $columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_permission_model_type_primary');
      }
    });

    Schema::create($tableNames['model_has_roles'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotRole, $teams) {
      $table->unsignedBigInteger('role_id');

      $table->string('model_type', 255);
      $table->unsignedBigInteger($columnNames['model_morph_key']);
      $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_roles_model_id_model_type_index');

      $table->foreign('role_id')
        ->references('id')
        ->on($tableNames['roles'])
        ->cascadeOnDelete();

      if ($teams) {
        $table->unsignedBigInteger($pivotRole);
        $table->index($pivotRole, 'model_has_roles_team_foreign_key_index');
        $table->primary([$pivotRole, 'role_id', $columnNames['model_morph_key'], 'model_type'], 'model_has_roles_role_model_type_primary');
      } else {
        $table->primary(['role_id', $columnNames['model_morph_key'], 'model_type'], 'model_has_roles_role_model_type_primary');
      }
    });

    Schema::create($tableNames['role_has_permissions'], function (Blueprint $table) use ($tableNames) {
      $table->unsignedBigInteger('permission_id');
      $table->unsignedBigInteger('role_id');

      $table->foreign('permission_id')
        ->references('id')
        ->on($tableNames['permissions'])
        ->cascadeOnDelete();

      $table->foreign('role_id')
        ->references('id')
        ->on($tableNames['roles'])
        ->cascadeOnDelete();

      $table->primary(['permission_id', 'role_id']);
    });
  }

  public function down(): void
  {
    $tableNames = config('permission.table_names', [
      'roles' => 'roles',
      'permissions' => 'permissions',
      'model_has_permissions' => 'model_has_permissions',
      'model_has_roles' => 'model_has_roles',
      'role_has_permissions' => 'role_has_permissions',
    ]);

    Schema::dropIfExists($tableNames['role_has_permissions']);
    Schema::dropIfExists($tableNames['model_has_roles']);
    Schema::dropIfExists($tableNames['model_has_permissions']);
    Schema::dropIfExists($tableNames['roles']);
    Schema::dropIfExists($tableNames['permissions']);
  }
};
