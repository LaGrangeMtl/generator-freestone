<?php	
	$root = __DIR__ . '/../../..';
	require_once($root.'/freestone/bootstrapFreestone.php');
	bootstrapFreestone($root);
	
	use Freestone\Frontendv2\Modules\Feedback\Email;
	use Freestone\Frontendv2\Modules\Feedback\FeedbackConstants;

	if (isset($_POST['feedback'])) {
		header('Content-Type: application/json');
		$sentMessages = [];
		
		foreach ($_POST['feedback'] as $id) {
			$email = new Email($id);
			$res = (object) $email->send();

			if ($res->code !== FeedbackConstants::CODE_OK) {
				http_response_code($res->code);
				$res->sentMessages = $sentMessages;

				echo json_encode($res);
				die();
			} else {
				$sentMessages[] = $id;
			}
		}

		echo json_encode((object) [
			'code' => FeedbackConstants::CODE_OK,
			'messages' => [],
			'sentMessages' => $sentMessages,
		]);
	}
?>