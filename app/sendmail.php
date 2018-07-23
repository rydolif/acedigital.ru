<?php
	$SITE_TITLE = 'Acedigital';
	$SITE_DESCR = '';


	if ( isset($_POST) ) {
		$subject = htmlspecialchars(trim($_POST['subject']));
		$name = htmlspecialchars(trim($_POST['name']));
		$email = htmlspecialchars(trim($_POST['email']));
		$phone = htmlspecialchars(trim($_POST['phone']));
		$site = isset($_POST['site']) ? htmlspecialchars(trim($_POST['site'])) : '';
		$comment = isset($_POST['comment']) ? htmlspecialchars(trim($_POST['comment'])) : '';


		$to = 'Elena357910@yandex.com';

		$headers = "From: $SITE_TITLE \r\n";
		$headers .= "Reply-To: ". $email . "\r\n";
		$headers .= "Content-Type: text/html; charset=utf-8\r\n";

		$data = '<h1>'.$subject."</h1>";
		$data .= 'Имя: '.$name."<br>";
		$data .= 'E-mail: '.$email."<br>";
		$data .= 'Телефон: '.$phone."<br>";
		if($site){
			$data .= 'Web-сайт: '.$site."<br>";
		}
		if($comment){
			$data .= 'Комментарий: '.$comment."<br>";
		}

		$message = "<div style='background:#F5F5F5;border-radius:10px;padding:20px;'>
				".$data."
				<br>\n
				<hr>\n
				<br>\n
				<small>This message was sent by the user from the ".$SITE_TITLE." site. Respond to the message itself is not necessary.</small>\n</div>";
		$send = mail($to, $subject, $message, $headers);

		if ( $send ) {
			echo 'success';
		} else {
			echo '<div class="error">error</div>';
		}

	}
	else {
			echo '<div class="error">error</div>';
	}
	die();
?>