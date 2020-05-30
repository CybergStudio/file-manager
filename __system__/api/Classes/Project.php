<?php
    // Nesta classe vai as funções gerais do projeto
    class Project
    {
        public static function systemVersion()
        {
            $version = "VERSÃO 2.1.4";
            
            return $version;
        }

        public static function footerInf()
        {
            $inf = '<i class="far fa-copyright"></i> 2019 - ' . Date('Y') . '. Todos os Direitos Reservados. Software desenvolvido por UrbanCode.';

            return $inf;
        }

        public static function validarCPF($cpf = null)
        {
            if (empty($cpf)) return false;
            
            $cpf = preg_replace("/[^0-9]/", "", $cpf);
            $cpf = str_pad($cpf, 11, '0', STR_PAD_LEFT);
            
            if (strlen($cpf) != 11) {
                return false;
            } elseif (
                $cpf == '00000000000' || 
                $cpf == '11111111111' || 
                $cpf == '22222222222' || 
                $cpf == '33333333333' || 
                $cpf == '44444444444' || 
                $cpf == '55555555555' || 
                $cpf == '66666666666' || 
                $cpf == '77777777777' || 
                $cpf == '88888888888' || 
                $cpf == '99999999999') {
                return false;
            } else {
                for ($t = 9; $t < 11; $t++) {
                    for ($d = 0, $c = 0; $c < $t; $c++) {
                        $d += $cpf[$c] * (($t + 1) - $c);
                    }
                    $d = ((10 * $d) % 11) % 10;
                    if ($cpf[$c] != $d) {
                        return false;
                    }
                }

                return true;
            }
        }

        public static function isXmlHttpRequest()
        {
            $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) ? $_SERVER['HTTP_X_REQUESTED_WITH'] : null;
            return (strtolower($isAjax) === 'xmlhttprequest');
        }

        public static function baseUrl()
        {
            return "http://localhost/casadacrianca/__system__/";
        }

        public static function baseUrlPhp()
        {
            return "http://localhost/casadacrianca/";
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

        public static function descobrirIdade($datanasc = null)
        {
            $dia = Date('d');
            $mes = Date('m');
            $ano = Date('Y');

            $nasc = explode("-", $datanasc);
            $idade = $ano - $nasc[0];

            if ($mes < $nasc[1]) $idade--;
            elseif (($mes == $nasc[1]) && ($dia <= $nasc[2])) $idade--;

            return $idade;
        }

        public static function formatRegister($date = null)
        {
            $format = Date("d/m/Y H:i:s", strtotime($date));

            return $format;
        }

        public static function formatDate($date = null)
        {
            $format = Date("d/m/Y", strtotime($date));

            return $format;
        }

        public static function formatDatetimeToSql($datetime = null)
        {
            $format = null;
            
            if ($datetime !== null) {
                $exp = explode(" ", $datetime);
                $date = explode("/", $exp[0]);

                $format = "{$date[2]}-{$date[1]}-{$date[0]} {$exp[1]}";
            }

            return $format;
        }

        public static function formatGenero($gen = null)
        {
            $gen = ($gen === "M") ? "Masculino" : "Feminino";

            return $gen;
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

        public static function formatLastName($lname = null)
        {
            $lname = trim($lname);
            $exp = explode(" ", $lname);
            $lname = "";

            foreach ($exp as $v) {
                $v = str_replace(" ", "", $v);
                $v = mb_strtolower($v);
                
                if (($v != "do") && ($v != "dos") && ($v != "das") && ($v != "da") && ($v != "de")) {
                    $v = ucfirst($v);
                }

                if ($v != "") $lname .= $v . " ";
            }

            return trim($lname);
        }

        public static function formatFirstNameToLower($fname = null)
        {
            $fname = trim($fname);
            $exp = explode(" ", $fname);
            $fname = "";

            foreach ($exp as $v) {
                $v = str_replace(" ", "", $v);
                $v = Project::removeAccentuation(mb_strtolower($v));

                $fname .= $v;
            }

            return trim($fname);
        }

        public static function formatMonthByNumber($number = null)
        {
            if (strlen($number) === 1) $number = "0" . $number;
            $month = null;
            
            switch ($number) {
                case "01":
                    $month = "Jan";
                    break;
                case "02":
                    $month = "Fev";
                    break;
                case "03":
                    $month = "Mar";
                    break;
                case "04":
                    $month = "Abr";
                    break;
                case "05":
                    $month = "Mai";
                    break;
                case "06":
                    $month = "Jun";
                    break;
                case "07":
                    $month = "Jul";
                    break;
                case "08":
                    $month = "Ago";
                    break;
                case "09":
                    $month = "Set";
                    break;
                case "10":
                    $month = "Out";
                    break;
                case "11":
                    $month = "Nov";
                    break;
                case "12":
                    $month = "Dez";
                    break;
            }

            return $month;
        }

        public static function setToUtf8($data = array())
        {
            foreach ($data as $key => $value) {
                foreach ($data[$key] as $k => &$v) {
                    $v = utf8_encode($v);
                }
            }

            return $data;
        }

        public static function passwordGenerator(
            int $tamanho = 1, bool $maiusculas = true, bool $minusculas = true, 
            bool $numeros = true, bool $simbolos = true
        )
        {
            $ma = "ABCDEFGHIJKLMNOPQRSTUVYXWZ"; // $ma contem as letras maiúsculas
            $mi = "abcdefghijklmnopqrstuvyxwz"; // $mi contem as letras minusculas
            $nu = "0123456789"; // $nu contem os números
            $si = "!@#$&*_+="; // $si contem os símbolos
            $senha = "";
           
            if ($maiusculas) {
                // se $maiusculas for "true", a variável $ma é embaralhada e adicionada para a variável $senha
                $senha .= str_shuffle($ma);
            }
           
            if ($minusculas) {
                // se $minusculas for "true", a variável $mi é embaralhada e adicionada para a variável $senha
                $senha .= str_shuffle($mi);
            }
        
            if ($numeros) {
                // se $numeros for "true", a variável $nu é embaralhada e adicionada para a variável $senha
                $senha .= str_shuffle($nu);
            }
        
            if ($simbolos) {
                // se $simbolos for "true", a variável $si é embaralhada e adicionada para a variável $senha
                $senha .= str_shuffle($si);
            }
        
            // retorna a senha embaralhada com "str_shuffle" com o tamanho definido pela variável $tamanho
            return substr(str_shuffle($senha), 0, $tamanho);
        }

        public static function hashGenerator()
        {
            $sql = new Sql();

            $c = 0;
            while ($c == 0) {
                $hash = rand(001, 999);
                if (strlen($hash) < 3) {
                    if (strlen($hash) == 2) $hash = "0" . $hash;
                    else $hash = "00" . $hash;
                }
                $hash = Date("y") . $hash;
                
                $results = $sql->select("SELECT hash_atend FROM jovem_espera WHERE hash_atend = :h", [
                    ":h" => $hash
                ]);
                
                if (count($results) === 0) $c = 1;
            }

            return $hash;
        }

        public static function getInativate() // Buscando Jovens que já acabaram a inatividade de contato
        {
            $sql = new Sql();

            $jovens_inativos = $sql->select("SELECT j.idjovem, j.registro_contato, c.resultado FROM jovem_espera j JOIN contato_feito c ON c.jovem = j.idjovem WHERE j.contato_feito = '1' AND j.registro_contato IS NOT NULL ORDER BY c.idcontato DESC LIMIT 1");
            foreach ($jovens_inativos as $v) {
                $month = substr($v['registro_contato'], 5, 2);
                $year = substr($v['registro_contato'], 0, 4);
                $monthYear = substr($v['registro_contato'], 0, 7);
                
                if ($v['resultado'] === "Adiou (Próximo Semestre)") {
                    
                    if ((int)$month <= 6) {

                        if (time() >= strtotime($year . "-07")) {
                            $stmt = $sql->query("UPDATE jovem_espera SET registro_contato = NULL, contato_feito = '0' WHERE idjovem = :id", [
                                ":id" => $v['idjovem']
                            ]);
                            
                            $_SESSION[User::SESSION]['jovens_inativos'][] = $v['idjovem'];
                        }

                    } else {

                        if (time() >= strtotime(($year + 1) . "-01")) {
                            $stmt = $sql->query("UPDATE jovem_espera SET registro_contato = NULL, contato_feito = '0' WHERE idjovem = :id", [
                                ":id" => $v['idjovem']
                            ]);
                            
                            $_SESSION[User::SESSION]['jovens_inativos'][] = $v['idjovem'];
                        }

                    }

                } elseif ($v['resultado'] === "Não demonstrou interesse") {


                    if (time() >= strtotime(($year + 1) . "-01")) {
                        $stmt = $sql->query("UPDATE jovem_espera SET registro_contato = NULL, contato_feito = '0' WHERE idjovem = :id", [
                            ":id" => $v['idjovem']
                        ]);
                        
                        $_SESSION[User::SESSION]['jovens_inativos'][] = $v['idjovem'];
                    }

                }
            }
        }

        public static function clearFolder(string $folderPath, bool $delete = false)
        {
            $folderArray = explode('/', $folderPath);
            $nameFolder = $folderArray[count($folderArray) - 1];

            $iterator = new RecursiveDirectoryIterator($folderPath, FilesystemIterator::SKIP_DOTS);
            $rec_iterator = new RecursiveIteratorIterator($iterator, RecursiveIteratorIterator::CHILD_FIRST);

            foreach ($rec_iterator as $file) {
                $file->isFile() ? unlink($file->getPathname()) : rmdir($file->getPathname());
            }

            if ($delete && $nameFolder !== 'src') {
                rmdir($folderPath);
            }
        }
    }
