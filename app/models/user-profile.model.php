<?php

class ProfileInfo extends Dbh {

    protected function getProfileInfo($id) {
        $stmt = $this->connect()->prepare("SELECT * FROM profiles WHERE user_id = ?");

        if (!$stmt->execute([$id])) {
            $stmt = null;
            header("location: /main-menu");
            exit();
        }
//
//        if ($stmt->rowCount() === 0) {
//            $stmt = null;
//            $_SESSION["error"] = "profilenotfound";
//            header("location: /main-menu");
//
//            exit();
//        }

        $profileData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $profileData;
    }

    protected function editProfileInfo($id, $about) {
        $stmt = $this->connect()->prepare("UPDATE profiles SET about = ? WHERE user_id = ?;");

        if (!$stmt->execute([$about, $id])) {
            $stmt = null;
            $_SESSION["error"] = "cannotupdate";
//            header("location: user-profile");
            exit();
        }
        $stmt = null;
    }

    protected function setProfileInfo($id, $about) {
        $stmt = $this->connect()->prepare("INSERT INTO profiles (user_id, about) VALUES (?, ?);");

        if (!$stmt->execute([$id, $about])) {
            $stmt = null;
            $_SESSION["error"] = "cannotsetprofileinfo";
//            header("location: user-profile");
            exit();
        }
        $stmt = null;
    }
}