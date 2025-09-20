<?php
class Database {
    public static $connect;

    public static function connect() {
        if (!self::$connect) {
            self::$connect = mysqli_connect("localhost", "root", "", "db_myblog");
        }
        return self::$connect;
    }

    public static function close() {
        if (self::$connect) {
            mysqli_close(self::$connect);
            self::$connect = null;
        }
    }
}
?>