<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
	return View::make('editor');
});

Route::controller('login', 'LoginController');

Route::get('ghauthenticate', 'GitHubController@authenticate');

Route::get('ghcheckloggedin', 'GitHubController@checkLoggedIn');

Route::get('ghapi/{key?}', 'GitHubController@githubApi');