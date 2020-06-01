<?php
    $data = Cloud::checkCloud($URL);

    if ((int)$data['status'] === 0) {
        echo isset($data['error']) ? "<h2>{$data['error']}</h2>" : 'An unexpected error occurred.';
        exit;
    } elseif ((int)$data['status'] === 3) {
        header("Location: " . Project::baseUrlPhp() . "cloud/{$data['cloudsName']}");
        exit;
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?= isset($URL[2]) ? $URL[2] : 'Cloud'; ?> - File Manager</title>
    
    <link rel="stylesheet" type="text/css" 
        media="screen" href="<?= Project::baseUrl(); ?>assets/css/main.css" />
    <link href="<?= Project::baseUrl(); ?>libs/fontawesome-free-5.8.0-web/css/all.css"
        rel="stylesheet" />
</head>
<body>
    <div class="l-wrapper">
        <div class="l-header">
            <?php include('__system__/includes/header.php'); ?>
        </div>
        <div class="l-main">
            <input type="hidden" path-func value="/<?= $URL[2]; ?>" />

            <div class="cloud-container" cloud-container>
                <h3 class="help-block-cloud">
                    <i class="fa fa-circle-notch fa-spin"></i> &nbsp;Wait a few seconds, please...
                </h3>
            </div>
        
        </div>

        <div class="my-progress-modal" id="my-progress-modal">
            <div class="progress-content-modal">
                <span class="close-progress-modal">&times;</span>
                <div class="show-progress-modal">
                    <h4 class="progress-modal-title" progress-msg></h4>

                    <div class="progress-bar">
                        <div progress-div>0%</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="my-progress-modal" id="my-view-image-modal">
            <div class="progress-content-modal">
                <span class="close-progress-modal">&times;</span>
                <div class="show-view-image-modal">
                    <h4 class="progress-modal-title">Image view</h4>

                    <p align="center"><small img-path></small></p>

                    <div align="center">
                        <img img-view style="max-width:80%;height:auto;padding-top:.6rem;" src="">
                    </div>
                </div>
            </div>
        </div>

        <div class="my-error-modal" id="my-error-modal">
            <div class="show-error-modal">
                <h4 class="error-title"><i class="fas fa-lightbulb"></i> &nbsp;TIPS:</h4>
                <div class="error-text">
                    When you type it's name, click on <b>ENTER</b> to save.
                    <hr/>
                    To <b>cancel</b> this action, <b>pass your mouse over the field</b> and click on the '<b><i class="fas fa-minus"></i></b>' icon.
                </div>
            </div>
        </div>
        
        <div class="l-footer">
            <?php include('__system__/includes/footer.php'); ?>
        </div>
    </div>

    <script src="<?= Project::baseUrl(); ?>libs/jquery-3.4.1.min.js"></script>
    <script src="<?= Project::baseUrl(); ?>libs/sweetalert2.all.min.js"></script>
    <script src="<?= Project::baseUrl(); ?>js/main.js"></script>

    <script src="<?= Project::baseUrl(); ?>js/getAllFolders.js"></script>
    <script src="<?= Project::baseUrl(); ?>js/cloudManager.js"></script>
    <script src="<?= Project::baseUrl(); ?>js/cloudActions.js"></script>
    <script src="<?= Project::baseUrl(); ?>js/cloudHistory.js"></script>
    <script>
        document.querySelector("[cloud-link]").classList.add('active')

        $("[other-clouds-click]").click(function() {
            $(this).find('ul').slideToggle(200)
        })
    </script>
</body>
</html>