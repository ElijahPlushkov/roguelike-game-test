<?php

class SignupController extends Signup {
    private $username;
    private $password;

    public function __construct($username, $password) {
        $this->username = $username;
        $this->password = $password;
    }

    public function validateUserInput() {
        if ($this->emptyInput() === false) {
            header("Location: main-menu.view.php");
            exit();
        }

        if ($this->invalidUsername() === false) {
            header("Location: main-menu.view.php");
            exit();
        }

        if ($this->usernameTaken() === false) {
            header("Location: main-menu.view.php");
            exit();
        }

        $this->registerUser($this->username, $this->password);

    }

    private function emptyInput(): bool {
        if (empty($this->username) || empty($this->password)) {
            $result = false;
        }
        else {
            $result = true;
        }
        return $result;
    }

    private function invalidUsername(): bool {
        if (!preg_match("/^[a-zA-Z0-9]*$/", $this->username)) {
            $result = false;
        }
        else {
            $result = true;
        }
        return $result;
    }

    private function usernameTaken(): bool {
        if (!$this->checkUser($this->username)) {
            $result = false;
        }
        else {
            $result = true;
        }

        return $result;
    }

    public function fetchUserId($username) {
        $id = $this->getUserId($username);
        return $id["id"];
    }
}