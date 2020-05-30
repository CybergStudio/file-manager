<?php 
    if (Project::isXmlHttpRequest()) {
        $json = [];
        $json['status'] = 1;

        if (isset($_POST['getDirectory'])) {

            $json['folder'] = [];
            $folderPath  = '__system__/nuvem' . $_POST['getDirectory'];
            
            if (is_dir($folderPath)) {
                $directory = dir($folderPath);

                if (!$directory) {
                    $json['status'] = 0;
                    $json['error'] = 'Ocorreu um erro ao buscar o conteúdo do diretório.';
                } else {
                    while ($name = $directory->read()) {
                        if ($name === '.' || $name === '..') {
                            continue;
                        }
                        
                        if (is_dir($folderPath . '/' . $name)) {
                            array_push($json['folder'], [
                                'icon' => 'fas fa-folder',
                                'name' => $name
                            ]);
                        }
                    }
                }

                $directory->close();
                asort($json['folder']);

                $json['folder'] = [ ...$json['folder'] ];
            }
            
        } elseif (isset($_POST['uploadDirectory'])) {
            $json['filesSucceded'] = [];
            $json['filesFailed'] = [];

            if (isset($_FILES)) {
                $json['directory'] = $_POST['uploadDirectory'];

                foreach ($_FILES['upload']['error'] as $key => $error) {
                    $name = $_FILES['upload']['name'][$key];
                    $tmp_name = $_FILES['upload']['tmp_name'][$key];
                    $path = '__system__/nuvem' . $json['directory'];
                    $filePath = $path . '/' . $name;

                    if (!file_exists($filePath)) {

                        if (move_uploaded_file($tmp_name, $filePath)) {
                            array_push($json['filesSucceded'], [
                                "name" => $name,
                                "size" => filesize($filePath)
                            ]);
                        } else {
                            array_push($json['filesFailed'], [
                                "name" => $name
                            ]);
                        }

                    } else {
                        for ($c = 1, $done = false; $done !== true; $c++) {
                            $inf = pathinfo($filePath);
                            $newName = $inf['filename'] . " ({$c})." . $inf['extension'];
                            $newFilePath = $path . '/' . $newName;

                            if (!file_exists($newFilePath)) {
                                $done = true;
                                $filePath = $newFilePath;
                                $name = $newName;
                            }
                        }

                        if (isset($done) && $done) {
                            if (move_uploaded_file($tmp_name, $filePath)) {
                                array_push($json['filesSucceded'], [
                                    "name" => $name,
                                    "size" => filesize($filePath)
                                ]);
                            } else {
                                array_push($json['filesFailed'], [
                                    "name" => $name
                                ]);
                            }
                        }
                    }
                }

            } else {
                $json['status'] = 600;
            }
        } elseif (isset($_POST['folderAdd'])  && isset($_POST['directory'])) {

            $json['nameFolder'] = $_POST['folderAdd'];
            $dirname = '__system__/nuvem' . $_POST['directory'];
            $directory = $dirname . '/' . $json['nameFolder'];

            if (is_dir($directory)) {
                for ($c = 1, $done = false; $done !== true; $c++) {
                    $newName = $json['nameFolder'] . " ({$c})";
                    $newDirectory = $dirname . '/' . $newName;

                    if (!is_dir($newDirectory)) {
                        $done = true;
                        $directory = $newDirectory;
                        $json['nameFolder'] = $newName;
                    }
                }

                if (isset($done) && $done) {
                    if (!mkdir($directory)) {
                        $json['status'] = 0;
                    }
                } else {
                    $json['status'] = 0;
                }
            } else {
                if (!mkdir($directory)) {
                    $json['status'] = 0;
                }
            }

        } elseif (isset($_POST['folderRename'])  && isset($_POST['newFolder'])) {

            $oldName = '__system__/nuvem' . $_POST['folderRename'];
            $json['nameFolder'] = $_POST['newFolder'];

            if (is_dir($oldName)) {
                $info = pathinfo($oldName);
                $newName = $info['dirname'] . "/" . $json['nameFolder'];

                if ($newName === $oldName || !is_dir($newName)) {
                    if (!rename($oldName, $newName)) {
                        $json['status'] = 0;
                    }
                } else {
                    for ($c = 1, $done = false; $done !== true; $c++) {
                        $newFolderFor = $json['nameFolder'] . " ({$c})";
                        $newNameFor = $info['dirname'] . '/' . $newFolderFor;
    
                        if (!is_dir($newNameFor)) {
                            $done = true;
                            $newName = $newNameFor;
                            $json['nameFolder'] = $newFolderFor;
                        }
                    }
    
                    if (isset($done) && $done) {
                        if (!rename($oldName, $newName)) {
                            $json['status'] = 0;
                        }
                    } else {
                        $json['status'] = 0;
                    }
                }
            } else {
                $json['status'] = 0;
            }

        } elseif (isset($_POST['folderDelete'])) {

            $directory = '__system__/nuvem' . $_POST['folderDelete'];
            if (!is_dir($directory)) {
                $json['status'] = 0;
            } else {
                Project::clearFolder($directory, true);
            }

        } elseif (isset($_POST['folderClear'])) {

            $directory = '__system__/nuvem' . $_POST['folderClear'];
            if (!is_dir($directory)) {
                $json['status'] = 0;
            } else {
                Project::clearFolder($directory, false);
            }

        } elseif (isset($_POST['oldFile'])  && isset($_POST['newFile'])) {

            $oldName = '__system__/nuvem' . $_POST['oldFile'];
            $json['newFileName'] = $_POST['newFile'];

            if (file_exists($oldName)) {
                $infoOld = pathinfo($oldName);
                $newName = $infoOld['dirname'] . "/" . $json['newFileName'];

                $infoNew = pathinfo($newName);

                if ($newName === $oldName || !file_exists($newName)) {
                    if (!rename($oldName, $newName)) {
                        $json['status'] = 4;
                    }
                } else {
                    for ($c = 1, $done = false; $done !== true; $c++) {
                        $newFileNameFor = $infoNew['filename'] . " ({$c})." . $infoNew['extension'];
                        $newNameFor = $infoNew['dirname'] . '/' . $newFileNameFor;
    
                        if (!file_exists($newNameFor)) {
                            $done = true;
                            $newName = $newNameFor;
                            $json['newFileName'] = $newFileNameFor;
                        }
                    }
    
                    if (isset($done) && $done) {
                        if (!rename($oldName, $newName)) {
                            $json['status'] = 3;
                        }
                    } else {
                        $json['status'] = 2;
                    }
                }
            } else {
                $json['status'] = 0;
            }

        } elseif (isset($_POST['fileDelete'])) {

            $path = '__system__/nuvem' . $_POST['fileDelete'];
            if (!file_exists($path)) {
                $json['status'] = 0;
            } else {
                if (!unlink($path)) {
                    $json['status'] = 0;
                }
            }

        } else {
            $json['nuvem'] = ['folder' => [], 'file' => []];

            $path = '__system__/nuvem' . (isset($_POST['directoryContent']) ? $_POST['directoryContent'] : $_POST['getNuvem']);

            if (is_dir($path)) {
                $directory = dir($path);

                if (!$directory) {
                    $json['status'] = 0;
                    $json['error'] = 'Ocorreu um erro ao buscar o conteúdo do diretório.';
                } else {
                    while ($name = $directory->read()) {
                        if ($name === '.' || $name === '..') {
                            continue;
                        }

                        $pathDir = '__system__/nuvem' . (isset($_POST['directoryContent']) ? $_POST['directoryContent'] : $_POST['getNuvem']) . '/' . $name;
                        
                        if (is_dir($pathDir)) {
                            $scandir = scandir($pathDir);

                            array_push($json['nuvem']['folder'], [
                                'icon' => 'fas fa-folder',
                                'name' => $name,
                                'empty' => count(scandir($pathDir)) > 2 ? false : true
                            ]);
                        } else {
                            $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
                            $isImage = false;

                            switch ($extension) {
                                case 'jpg':
                                    $icon = 'fas fa-file-image';
                                    $isImage = true;
                                    break;
                                case 'jpeg':
                                    $icon = 'fas fa-file-image';
                                    $isImage = true;
                                    break;
                                case 'gif':
                                    $icon = 'fas fa-file-image';
                                    $isImage = true;
                                    break;
                                case 'png':
                                    $icon = 'fas fa-file-image';
                                    $isImage = true;
                                    break;
                                case 'svg':
                                    $icon = 'fas fa-file-image';
                                    $isImage = true;
                                    break;
                                
                                case 'doc':
                                    $icon = 'fas fa-file-word';
                                    break;
                                case 'docx':
                                    $icon = 'fas fa-file-word';
                                    break;
                                
                                case 'xls':
                                    $icon = 'fas fa-file-excel';
                                    break;
                                case 'xlt':
                                    $icon = 'fas fa-file-excel';
                                    break;
                                
                                case 'ppt':
                                    $icon = 'fas fa-file-powerpoint';
                                    break;
                                case 'pptx':
                                    $icon = 'fas fa-file-powerpoint';
                                    break;
                                
                                case 'mp4':
                                    $icon = 'fas fa-file-video';
                                    break;
                                
                                case 'mp3':
                                    $icon = 'fas fa-file-audio';
                                    break;
                                
                                case 'pdf':
                                    $icon = 'fas fa-file-pdf';
                                    break;
                        
                                case 'zip':
                                    $icon = 'fas fa-file-archive';
                                    break;
                                
                                default:
                                    $icon = 'fas fa-file-alt';
                                    break;
                            }

                            array_push($json['nuvem']['file'], [
                                'icon' => $icon,
                                'name' => $name,
                                'isImage' => $isImage
                            ]);
                        }
                    }
                }

                $directory->close();

                asort($json['nuvem']['folder']);
                asort($json['nuvem']['file']);

                $json['nuvem']['folder'] = [ ...$json['nuvem']['folder'] ];
                $json['nuvem']['file'] = [ ...$json['nuvem']['file'] ];
            } else {
                $json['status'] = 3;
            }
        }

        echo json_encode($json);
    } else {

        if (isset($_POST['fileDownload'])) {
            $path = '__system__/nuvem' . $_POST['fileDownload'];
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
    }
