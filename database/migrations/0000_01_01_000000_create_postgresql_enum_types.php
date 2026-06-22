<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
  /**
   * PostgreSQL native enum types for TalentBridge.
   */
  public function up(): void
  {
    $this->dropEnumTypes();

    DB::unprepared("CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification')");
    DB::unprepared("CREATE TYPE verification_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'resubmission_required')");
    DB::unprepared("CREATE TYPE job_status AS ENUM ('draft', 'published', 'closed', 'archived')");
    DB::unprepared("CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'internship', 'temporary', 'freelance')");
    DB::unprepared("CREATE TYPE work_mode AS ENUM ('onsite', 'remote', 'hybrid')");
    DB::unprepared("CREATE TYPE application_status AS ENUM ('submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'interviewed', 'offered', 'hired', 'rejected', 'withdrawn')");
    DB::unprepared("CREATE TYPE interview_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled')");
    DB::unprepared("CREATE TYPE interview_type AS ENUM ('phone', 'video', 'onsite', 'technical', 'panel', 'hr')");
    DB::unprepared("CREATE TYPE notification_channel AS ENUM ('database', 'mail', 'push')");
    DB::unprepared("CREATE TYPE notification_type AS ENUM ('application_status', 'interview_scheduled', 'interview_reminder', 'job_match', 'verification_update', 'system')");
    DB::unprepared("CREATE TYPE file_type AS ENUM ('resume', 'cover_letter', 'company_logo', 'company_document', 'profile_photo', 'other')");
    DB::unprepared("CREATE TYPE audit_action AS ENUM ('created', 'updated', 'deleted', 'restored', 'login', 'logout', 'exported')");
    DB::unprepared("CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'cancelled', 'expired')");
  }

  public function down(): void
  {
    $this->dropEnumTypes();
  }

  private function dropEnumTypes(): void
  {
    DB::unprepared('DROP TYPE IF EXISTS subscription_status CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS audit_action CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS file_type CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS notification_type CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS notification_channel CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS interview_type CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS interview_status CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS application_status CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS work_mode CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS employment_type CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS job_status CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS verification_status CASCADE');
    DB::unprepared('DROP TYPE IF EXISTS user_status CASCADE');
  }
};
