<?php
    session_start();    

    include "messages.php";
    try {
        $connection = new PDO(
            'mysql:host=studentdb;dbname=wordle_rzp;port=3306',
            'samuel_kaspar_dbz',
            '7b0fac8a5aed44a460b3'
        );
    } catch (PDOException $e) {
        die("Error connecting to MySQL: {$e->getMessage()}");
    } 

//---------------------------------------------------------------------------------------------------------------------------------
if ($_POST['email-loginkey']){
    $messagehelper = new Messageshelper();
    $messagehelper->login($connection);
} else {
    echo   "<meta http-equiv=\"refresh\" content=\"0;URL='https://www.bdpastudents.com/code/run/c3372c0/BDPADrive/login.html'\" />" ;   
}
?>