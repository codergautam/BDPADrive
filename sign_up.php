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


    

    $query = "SELECT username FROM users";
    $statement = $connection->prepare($query);
    $statement->execute();
    $usernames = $statement->fetch(PDO::FETCH_ASSOC);

    $query = "SELECT password FROM users";
    $statement = $connection->prepare($query);
    $statement->execute();
    $passwords = $statement->fetch(PDO::FETCH_ASSOC);

    $query = "SELECT name FROM users";
    $statement = $connection->prepare($query);
    $statement->execute();
    $names = $statement->fetch(PDO::FETCH_ASSOC);
    $username2 = $_POST["usernamesignup"];
    $name2 = $_POST["namesignup"];

    if ($_POST["usernamesignup"]){
        if (in_array($username2, $usernames)){
            echo "<h3>Sorry, that username is already taken...<h3>";
            echo "<h3>Sign Up again<h3>";
            echo "<h2><a href='sign_up.html'>Sign Up</a></h2>";
            echo "<h2>...or you can <a href='destroy.php'>Log In</a>or <a href='guest.php'>Continue as a Guest</a></h2>";
        }elseif (in_array($name2, $names)){
            echo "<h3>Sorry, that name is already taken...<h3>";
            echo "<h3>Sign Up again<h3>";
            echo "<h2><a href='sign_up.html'>Sign Up</a></h2>";
            echo "<h2>...or you can <a href='destroy.php'>Log In</a>or <a href='guest.php'>Continue as a Guest</a></h2>";
        }else {
            $query = "INSERT INTO users(username, password, name) VALUES (?, ?, ?)";
            $statement = $connection->prepare($query);
            $statement->bindParam(1, $_POST['usernamesignup']);
            $statement->bindParam(2, password_hash($_POST['passwordsignup'], PASSWORD_DEFAULT));
            $statement->bindParam(3, $_POST['namesignup']);
            $a = $statement->execute();
            if ($a==1){
                echo "<h3>You are now Signed up!<h3>";
                echo "<h3>You can now log in<h3>";
                echo "<h2><a href='destroy.php'>Log In</a></h2>";
            }
        }
        
    }