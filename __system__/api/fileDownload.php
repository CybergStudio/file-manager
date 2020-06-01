<?php
    if (isset($_POST['fileDownload'])) {
        $path = '__system__/assets/cloud' . $_POST['fileDownload'];
        $info = pathinfo($path);

        if (!file_exists($path)) {
            echo 'O arquivo ' . $info['basename'] . ' é inexistente!';
        } else {
            $pathArray = explode('/', $path);
            $nameFile = $pathArray[count($pathArray) - 1];

            switch ($info['extension']) {
                case 'jpg':
                    $type = 'image/jpg';
                    break;
                case 'jpeg':
                    $type = 'image/jpeg';
                    break;
                case 'gif':
                    $type = 'image/gif';
                    break;
                case 'png':
                    $type = 'image/png';
                    break;
                case 'svg':
                    $type = 'image/svg';
                    break;
                
                case 'doc':
                    $type = 'application/msword';
                    break;
                case 'docx':
                    $type = 'application/msword';
                    break;
                
                case 'xls':
                    $type = 'application/vnd.ms-excel';
                    break;
                case 'xlt':
                    $type = 'application/vnd.ms-excel';
                    break;
                        
                case 'ppt':
                    $icon = 'application/vnd.ms-powerpoint';
                    break;
                case 'pptx':
                    $icon = 'application/vnd.ms-powerpoint';
                    break;
                
                case 'mp4':
                    $type = 'video/mp4';
                    break;
                
                case 'mp3':
                    $type = 'audio/mpeg';
                    break;
                
                case 'pdf':
                    $type = 'application/pdf';
                    break;
                
                case 'zip':
                    $type = 'application/zip';
                    break;
                
                case 'txt':
                    $type = 'text/plain';
                    break;
            }

            if (!isset($type) || $type === '') {
                echo 'Não temos suporte à este tipo de arquivo!';
            } else {
                $block = ['php', 'html', 'js', 'htm', 'css'];

                if (!in_array($info['extension'], $block)) {
                    header("Content-Type: " . $type);
                    header("Content-Length: " . filesize($path));
                    header("Content-Disposition: attachment; filename=" . $info['basename']);

                    readfile($path);
                    exit;
                } else {
                    echo 'Não temos suporte à este tipo de arquivo!';
                }
            }
        }

    } else {
        echo '<h2>Sem permição de acesso à essa página!</h2>';
    }
