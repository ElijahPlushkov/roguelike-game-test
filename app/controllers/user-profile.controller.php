<?php

class ProfileController extends ProfileInfo {
    private $id;
    private $username;

    public function __construct($id, $username) {
        $this->id = $id;
        $this->username = $username;
    }

    public function defaultProfileInfo() {
        $about = "A passionate gamer who loves challenges.";
        $this->setProfileInfo($this->id, $about);
    }

    public function updateProfileInfo($id, $about) {
        $this->editProfileInfo($id, $about);
    }

    public function getCurrentProfile($id): array {
        $profileModel = new ProfileInfo();
        return $profileModel->getProfileInfo($this->id ?? $id);
    }

    public function displayAbout($id) {
        $profileData = $this->getCurrentProfile($id);
        return $profileData[0]["about"];
    }
}