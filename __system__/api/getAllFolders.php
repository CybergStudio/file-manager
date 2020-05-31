<?php 
    if (Project::isXmlHttpRequest()) {
        echo json_encode(Cloud::getFolderContent('', false));
    } else {
        echo '
            <h2>
                Permission denied!
                <small>Unauthorized</small>
            </h2>
        ';
    }
