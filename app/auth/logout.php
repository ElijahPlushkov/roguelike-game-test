<?php

session_start();
session_unset();
session_destroy();

header("location: " . BASE_PATH . "/main-menu");
exit();