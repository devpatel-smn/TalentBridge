<?php

use App\Modules\Notification\Controllers\AdminNotificationController;
use App\Modules\Notification\Controllers\NotificationController;
use App\Modules\Notification\Controllers\NotificationPreferenceController;
use Illuminate\Support\Facades\Route;

Route::prefix('notifications')->name('notifications.')->group(function () {
    Route::get('/', [NotificationController::class, 'index'])->name('index');
    Route::get('unread-count', [NotificationController::class, 'unreadCount'])->name('unread-count');
    Route::post('read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
    Route::post('bulk-read', [NotificationController::class, 'bulkRead'])->name('bulk-read');
    Route::post('bulk-unread', [NotificationController::class, 'bulkUnread'])->name('bulk-unread');
    Route::get('{id}', [NotificationController::class, 'show'])->name('show');
    Route::patch('{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
    Route::patch('{id}/unread', [NotificationController::class, 'markAsUnread'])->name('unread');
});

Route::prefix('notification-preferences')->name('notification-preferences.')->group(function () {
    Route::get('/', [NotificationPreferenceController::class, 'index'])->name('index');
    Route::put('/', [NotificationPreferenceController::class, 'update'])->name('update');
});
