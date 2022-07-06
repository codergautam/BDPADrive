<?php

session_start();
$query = "SELECT name, username, email, password FROM users";
$statement = $connection->prepare($query);
$statement->execute();
$names = $statement->fetch(PDO::FETCH_ASSOC);