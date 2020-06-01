<?php 
    if (Project::isXmlHttpRequest()) {

        if (isset($_POST['validateName'])) {
            
            $json = Cloud::validateCloudsName($_POST['validateName']);

        } elseif (isset($_POST['cloudsName'])) {

            $json = Cloud::validateCloudsName($_POST['cloudsName']);
            if ((int)$json['status'] === 1) {
                if ($json['cloudsName'] !== '' && !Cloud::createFolder($json['cloudsName'])) {
                    $json['status'] = 0;
                    $json['error'] = 'An error occurred to create the cloud';
                }
            }

        }

        echo json_encode($json);

    } else {
        echo '
            <h2>
                Permission denied!
                <small>Unauthorized</small>
            </h2>
        ';
    }
