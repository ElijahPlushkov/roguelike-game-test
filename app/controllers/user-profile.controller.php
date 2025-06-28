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

    public function getCurrentProfile($id) {
        $profileInfo = $this->getProfileInfo($id);

        return $profileInfo;
    }

    public function displayAbout($id) {
        $profileData = $this->getCurrentProfile($id);
        $about =  $profileData[0]["about"];
        return $about;
    }
}