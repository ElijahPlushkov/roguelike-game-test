<?php

class UserProfileDisplay extends ProfileInfo {
    public function fetchAbout($id) {
        $profileInfo = $this->getProfileInfo($id);

        echo $profileInfo["about"];
    }
}