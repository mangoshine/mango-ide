<?php

class LoginController extends BaseController {

	/*
	|--------------------------------------------------------------------------
	| GitHub Login Controller
	|--------------------------------------------------------------------------
	|
	*/

	public function getIndex()
	{
		if ($clientID = getenv('GH_BASIC_CLIENT_ID')) {
			return Redirect::to('https://github.com/login/oauth/authorize?client_id='.$clientID);
        }
	}

}