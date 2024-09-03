<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1', 'as' => 'api.', 'namespace' => 'Api\V1\Admin', 'middleware' => ['auth:sanctum']], function () {
    // Abilities
    Route::apiResource('abilities', 'AbilitiesController', ['only' => ['index']]);

    // Locales
    Route::get('locales/languages', 'LocalesController@languages')->name('locales.languages');
    Route::get('locales/messages', 'LocalesController@messages')->name('locales.messages');

    // Permissions
    Route::resource('permissions', 'PermissionsApiController');

    // Roles
    Route::resource('roles', 'RolesApiController');

    // Users
    Route::resource('users', 'UsersApiController');

    Route::post('orders/media', 'OrdersApiController@storeMedia')->name('orders.storeMedia');
    Route::post('orders/destroyMedia', 'OrdersApiController@destroyMedia')->name('orders.destroyMedia');
    Route::get('order/report/{id}', 'OrdersApiController@report');

    Route::resource('orders', 'OrdersApiController');
    Route::resource('services', 'ServicesApiController');
    Route::post('services/success/{service}', 'ServicesApiController@success')->name('services.success');
    
    Route::resource('items', 'ItemApiController');

    // Change password
    Route::get('password/edit', 'ChangePasswordController@edit')->name('password.edit');
    Route::post('password', 'ChangePasswordController@update')->name('password.update');
    Route::post('profile', 'ChangePasswordController@updateProfile')->name('password.updateProfile');
    Route::post('profile/destroy', 'ChangePasswordController@destroy')->name('password.destroyProfile');

});