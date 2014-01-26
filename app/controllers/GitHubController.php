<?php

class GithubController extends BaseController {

	/*
	|--------------------------------------------------------------------------
	| GitHub Controller
	|
	| Uses the GitHub API.
	|--------------------------------------------------------------------------
	|
	*/

	/**
	 * Grant access to mango ide. Store access token in a session variable.
	 */
	public function authenticate()
	{
		$code = $_GET['code'];

		if ($code) {
			$ch = curl_init();
			$client_id = getenv('GH_BASIC_CLIENT_ID');
			$client_secret = getenv('GH_BASIC_SECRET_ID');
			$code = $_GET['code'];
			$redirect_uri = 'http://'.$_SERVER['HTTP_HOST'].'/ghauthenticate';
			curl_setopt($ch, CURLOPT_URL, 'https://github.com/login/oauth/access_token?' .
					'client_id='.$client_id.
					'&client_secret='.$client_secret.
					'&code='.$code.
					'&redirect_uri='.$redirect_uri);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			$response = curl_exec($ch);
			curl_close($ch);

			if ($response) {
				$json_response = json_decode($response, true);
				Session::put('access_token', $json_response['access_token']);
				return Redirect::to('http://'.$_SERVER['HTTP_HOST']);
			}
		}
	}

	/**
	 * Access GitHub API.
	 */
	public function githubApi($key = null)
	{
		$access_token = Session::get('access_token');
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, 'https://api.github.com/'.$key.'?access_token='.$access_token);
		curl_setopt($ch, CURLOPT_USERAGENT, 'mangoide');
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$response = curl_exec($ch);
		curl_close($ch);

		return $response;
	}

	/**
	 * Check if the user is logged in.
	 */
	public function checkLoggedIn()
	{
		$access_token = Session::get('access_token');
		if (!$access_token) {
			return 'not logged in';
		}

		// try to access api with the access token
		$response = $this->githubApi();

		$json_response = json_decode($response, true);
		if (array_key_exists('current_user_url', $json_response)) {
			return 'logged in';
		}

		return 'not logged in';
	}
}