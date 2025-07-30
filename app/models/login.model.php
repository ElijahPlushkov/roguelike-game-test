<?php

class Login extends Dbh {
    protected function retrieveUser($username, $password): void {
        $stmt = $this->connect()->prepare("SELECT * FROM users WHERE username= ?;");

        if(!$stmt->execute([$username])) {
            $stmt = null;
            $_SESSION['error'] = 'stmtfailed';
            header("location: main-menu.view.php");
            exit();
        }

        if ($stmt->rowCount() === 0) {
            $stmt = null;
            $_SESSION['error'] = 'usernotfound';
            header("location: main-menu.view.php");
            exit();
        }

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!password_verify($password, $user["password"])) {
            $stmt = null;
            $_SESSION['error'] = 'wrongpassword';
            header("location: main-menu.view.php");
            exit();
        }

        $_SESSION["id"] = $user["id"];
        $_SESSION["username"] = $user["username"];

        $stmt = null;
    }
}