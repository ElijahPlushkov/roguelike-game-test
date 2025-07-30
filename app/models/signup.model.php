<?php

class Signup extends Dbh {
    protected function checkUser($username) {
        $stmt = $this->connect()->prepare("SELECT username FROM users WHERE username = ?");

        if (!$stmt->execute(array($username))) {
            $stmt = null;
            header("location: main-menu.view.php");
            exit();
        }

        if ($stmt->rowCount() > 0) {
            $resultCheck = false;
        }
        else {
            $resultCheck = true;
        }

        return $resultCheck;
    }

    protected function registerUser($username, $password) {
        $stmt = $this->connect()->prepare("INSERT INTO users (username, password) VALUES (?, ?)");

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        if (!$stmt->execute(array($username, $hashedPassword))) {
            $stmt = null;
            header("location: main-menu.view.php");
            exit();
        }

        $stmt = null;
    }

    protected function getUserId($username) {
        $stmt = $this->connect()->prepare("SELECT id FROM users WHERE username = ?");

        if (!$stmt->execute([$username])) {
            $_SESSION["error"] = "cannotgetuserid";
            $stmt = null;
            header("location: user-profile.php");
            exit();
        }

        if ($stmt->rowCount() === 0) {
            $stmt = null;
            header("location: main-menu.view.php");
            exit();
        }

        $profileData = $stmt->fetch(PDO::FETCH_ASSOC);

        return $profileData;
    }
}
