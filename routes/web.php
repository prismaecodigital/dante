<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');
Route::redirect('/dashboard', '/admin/dashboard');

Auth::routes(['register' => false]);

Route::group([
    'prefix'     => 'admin',
    'as'         => 'admin.',
    'namespace'  => 'App\Http\Controllers\Admin',
    'middleware' => ['auth'],
], function () {
    Route::view('/{any?}', 'layouts.admin.app')->name('dashboard')->where('any', '.*');

});

Route::get('report/{id}', [HomeController::class, 'report']);
