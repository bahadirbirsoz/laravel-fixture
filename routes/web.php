<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', function () {
    return view('welcome');
});


Route::get('/play/{id}', 'MatchController@playWeek');

Route::get('/week/{id}', 'MatchController@week');

Route::get('/fixture', 'FixtureController@index');

Route::post('/fixture/reset', 'FixtureController@reset');

Route::get('/match/{id}', 'MatchController@index');

Route::post('/match/play-all', 'MatchController@playAll');

Route::post('/match/play/{id}', 'MatchController@play');

Route::put('/match/{id}', 'MatchController@update');

Route::put('/match/finish/{id}', 'MatchController@finish');

Route::put('/match/start/{id}', 'MatchController@start');

Route::put('/match/reset/{id}', 'MatchController@reset');



//Route::get('/fixture', 'FixtureController@index');



