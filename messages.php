<?php
if ($_POST['username'] && $_POST['password']){
    return;
} else {
    echo   "<meta http-equiv=\"refresh\" content=\"0;URL='file:///C:/Users/samue/code/BDPADrive/login.html'\" />" ;   
}
class Messageshelper {
	public function add_message($connection, $sender, $messa){
		date_default_timezone_set("America/Chicago");
		$date = date('Y-m-d h:i:s');
		$query = "INSERT INTO messages (message, sender, timestamp) VALUES (?, '".$sender."', '".$date."')";

		$statement = $connection->prepare($query);
		$statement->bindParam(1, $messa);
		$statement->execute();
	}

#-------------------------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------------------

	public function delete_message($connection, $num1){

		$query = "DELETE FROM messages WHERE id = ?";
		$statement = $connection->prepare($query);
		$statement->bindParam(1, $num1);
		$statement->execute();
	}

#-------------------------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------------------

	public function update_message($connection, $num2, $messag){

		$query = "UPDATE messages SET message = ? WHERE id = ?";

		$statement = $connection->prepare($query);
		$statement->bindParam(1, $messag);
		$statement->bindParam(2, $num2);
		$statement->execute();
	}

#-------------------------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------------------

	public function sign_up($connection){
		
		echo "        
		<form action='sign_up.php' method='post'>
            <div> Username:
              	<input type='text' name='usernamesignup' />
            </div>
            <div> Password:
              	<input type='password' name='passwordsignup' />
            </div>
            <div> Name:
              	<input type='text' name='namesignup' />
            </div>
            <div>
        		<input type='submit' value='Sign Up' />
            </div>
        </form>
		";
		$_SESSION['usernamesignup'] = $_POST['usernamesignup'];
		$_SESSION['passwordsignup'] = $_POST['passwordsignup'];
		$_SESSION['namesignup'] = $_POST['namesignup'];
		
	}

#-------------------------------------------------------------------------------------------------------------
#-------------------------------------------------------------------------------------------------------------

	public function login($connection){

	    if ($_POST['username'] && $_POST['password'] or $_SESSION['log']==1) {


			$query = "SELECT password, username, name, id FROM users WHERE username = ?";
			$statement = $connection->prepare($query);
			$statement->bindParam(1, $_POST['username']);
			$statement->execute();
			$userData = $statement->fetch(PDO::FETCH_ASSOC);

			if ($userData && password_verify($_POST['password'], $userData['password']) or $_SESSION['log']==1) {
            if( $_POST['password']!="") {
                $_SESSION['log'] = 1;
                $_SESSION['userid'] = $userData['id'];
                $_SESSION['name'] = $userData['name'];
                $_SESSION['password'] = $userData['password'];
                $_SESSION['username'] = $userData['username'];
				$_SESSION['authenication_state'] = 'authenicated';
            }
            $query = "SELECT name FROM users";
            $statementusers = $connection->prepare($query);
            $statementusers->execute();
            } else {
                $_SESSION['log'] = 0;
                echo "There is no user with those credentials<br>";
                echo "<h2><a href='destroy.php'>Log In</a></h2>";
				echo "<h2><a href='sign_up.html'>Sign_up</a></h2>";
				echo "<h2><a href='guest.php'>...or continue as guest</a></h2>";
            }
        }

    }
};
