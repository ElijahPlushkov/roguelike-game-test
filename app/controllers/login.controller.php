<?php

class LoginController extends Login
{
    private $username;
    private $password;

    public function __construct($username, $password)
    {
        $this->username = $username;
        $this->password = $password;
    }

    public function loginUser()
    {
        if ($this->emptyInput()) {
            $_SESSION['error'] = "emptyinput";
            header("Location: main-menu.view.php");
            exit();
        }

        $this->retrieveUser($this->username, $this->password);
    }

    private function emptyInput(): bool
    {
        return empty($this->username) || empty($this->password);
    }
}