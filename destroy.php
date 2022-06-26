<?php
session_start();
session_destroy();
$_SESSION['authenication_state'] = 'guest';
echo "<meta http-equiv=\"refresh\" content=\"0;URL='file:///C:/Users/samue/code/BDPADrive/login.html'\" />" ;   