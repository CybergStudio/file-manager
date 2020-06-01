<?php 
    if (Project::isXmlHttpRequest()) {
        $json = [];
        $json['status'] = 1;

        if (isset($_POST['folderAdd'])  && isset($_POST['directory'])) {

            $json['nameFolder'] = $_POST['folderAdd'];
            $dirname = '__system__/assets/cloud' . $_POST['directory'];
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

            $oldName = '__system__/assets/cloud' . $_POST['folderRename'];
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

            $directory = '__system__/assets/cloud' . $_POST['folderDelete'];
            if (!is_dir($directory)) {
                $json['status'] = 0;
            } else {
                Cloud::clearFolder($directory, true);
            }

        } elseif (isset($_POST['folderClear'])) {

            $directory = '__system__/assets/cloud' . $_POST['folderClear'];
            if (!is_dir($directory)) {
                $json['status'] = 0;
            } else {
                Cloud::clearFolder($directory, false);
            }

        } elseif (isset($_POST['oldFile'])  && isset($_POST['newFile'])) {

            $oldName = '__system__/assets/cloud' . $_POST['oldFile'];
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

            $path = '__system__/assets/cloud' . $_POST['fileDelete'];
            if (!file_exists($path)) {
                $json['status'] = 0;
            } else {
                if (!unlink($path)) {
                    $json['status'] = 0;
                }
            }

        } else {
            $json['cloud'] = ['folder' => [], 'file' => []];

            $path = '__system__/assets/cloud' . (isset($_POST['directoryContent']) ? $_POST['directoryContent'] : $_POST['getCloud']);

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

                        $pathDir = '__system__/assets/cloud' . (isset($_POST['directoryContent']) ? $_POST['directoryContent'] : $_POST['getCloud']) . '/' . $name;
                        
                        if (is_dir($pathDir)) {
                            $scandir = scandir($pathDir);

                            array_push($json['cloud']['folder'], [
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

                            array_push($json['cloud']['file'], [
                                'icon' => $icon,
                                'name' => $name,
                                'isImage' => $isImage
                            ]);
                        }
                    }
                }

                $directory->close();

                asort($json['cloud']['folder']);
                asort($json['cloud']['file']);

                $json['cloud']['folder'] = [ ...$json['cloud']['folder'] ];
                $json['cloud']['file'] = [ ...$json['cloud']['file'] ];
            } else {
                $json['status'] = 3;
            }
        }

        echo json_encode($json);
    } else {
        echo '<h2>Sem permição de acesso à essa página!</h2>';
    }
