<?php
    // General functions in here
    class Project
    {
        public static function isXmlHttpRequest()
        {
            $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) ? $_SERVER['HTTP_X_REQUESTED_WITH'] : null;
            return (strtolower($isAjax) === 'xmlhttprequest');
        }

        public static function baseUrl()
        {
            return "http://localhost/file-manager/__system__/";
        }

        public static function baseUrlPhp()
        {
            return "http://localhost/file-manager/";
        }

        public static function removeAccentuation($string)
        {
            $accentuation = [
                'à', 'á', 'â', 'ã', 'ä', 'å', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ù', 'ü', 'ú', 'ÿ', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'O', 'Ù', 'Ü', 'Ú'
            ];
            $noAccentuation = [
                'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'y', 'A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'N', 'O', 'O', 'O', 'O', 'O', '0', 'U', 'U', 'U'
            ];

            return str_replace($accentuation, $noAccentuation, $string);
        }

        public static function formatFirstName($fname = null)
        {
            $fname = trim($fname);
            $exp = explode(" ", $fname);
            $fname = "";

            foreach ($exp as $v) {
                $v = str_replace(" ", "", $v);
                $v = ucfirst(mb_strtolower($v));

                if ($v != "") $fname .= $v . " ";
            }

            return trim($fname);
        }

        public static function nameFormatter($fname = null)
        {
            $fname = trim($fname);
            $exp = explode(" ", $fname);
            $fname = "";

            foreach ($exp as $v) {
                $v = str_replace(" ", "", $v);
                $v = Project::removeAccentuation($v);

                $fname .= $v;
            }

            return trim($fname);
        }
    }
