<?php 
    if (Project::isXmlHttpRequest()) {
        $json = [];
        $json['status'] = 1;

        if (isset($_POST['uploadDirectory'])) {
            $json['filesSucceded'] = [];
            $json['filesFailed'] = [];

            if (isset($_FILES)) {
                $json['directory'] = $_POST['uploadDirectory'];

                foreach ($_FILES['upload']['error'] as $key => $error) {
                    $name = $_FILES['upload']['name'][$key];
                    $tmp_name = $_FILES['upload']['tmp_name'][$key];
                    $path = '__system__/assets/cloud' . $json['directory'];
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
        }

        echo json_encode($json);
    } else {
        echo '<h2>Sem permição de acesso à essa página!</h2>';
    }
