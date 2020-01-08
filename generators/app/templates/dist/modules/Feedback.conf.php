<?php

$feedbacks = [
	/*
		Indicates that the post key for this feedback will be 'careers', i.e. $_POST['careers'][...]
		For this config to be called, you must also have a $_POST['feedback'][] = 'careers' in your request
	*/
	'careers' => (object) [
		/*
			If is set, SMTP will be used to send the email, with the given conf.
		*/
		'smtp' => (object) [
			'host' => 'http://google.ca',
			'uname' => 'monuname',
			'pass' => 'monpassword',
		],

		/*
			Name of template will be based on that, with standardized path, e.g. c/whatever/views/emails/career_client.twig
		*/
		'template' => 'career_client',
		
		/*
			sender and recipients can be callbacks which would return values with the same structure

			'sender' => function($values) {
				return (object) [
					'name' => 'Jean-Punk',
					'email' => 'beaucohon@labattoir.com',
				];
			}
		*/
		'sender' => (object) [
			'name' => 'Jean-Punk',
			'email' => 'beaucohon@labattoir.com',
		],
		
		/*
			sender and recipients can be callbacks which would return values with the same structure

			'sender' => function($values) {
				return [
					'jacques@languirand.com' => 'Mr. Pedo',
				];
			}
		*/
		'recipients' => [
			'jacques@languirand.com' => 'Mr. Pedo',
		],
		
		/*
			if false, send as links, saving them to a standardized path, e.g. c/whatever/uploads/emails/fieldname/cochon.pdf. Otherwise, will attach them to the email.
		*/
		'attachFiles' => true,
		
		/*
			If set, a BasicModel of this table will be built and a record added with the values set in post
		*/
		'modelName' => 'career_application',

		/*
			called before values are passed anywhere 
		*/
		'formatValues' => function($postedValues) {
			//...
			return $postedValues;
		},

		/*
			called after emails are sent 
		*/
		'onSent' => function($formattedValues) {
			//whatever the fuck you want
		},
	],
];
