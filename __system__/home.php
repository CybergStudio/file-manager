<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>File Manager - Cyberg Tech Studio</title>
    
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

            <div class="cloud-choice">
                <div class="other-clouds">
                    <ul class="other-clouds-list" other-clouds-click>
                        <li class="other-clouds-list-item">
                            Click here to see other clouds  &nbsp;<i class="fas fa-angle-down"></i>
                        </li>

                        <ul class="other-clouds-list-dropdown" other-clouds-list>
                            <li class="other-clouds-list-dropdown-item no-cursor">
                                <i class="fa fa-circle-notch fa-spin"></i> &nbsp;Loading...
                            </li>
                        </ul>
                    </ul>
                </div>
                <div class="create-cloud">
                    <h4>
                        Create your own cloud
                    </h4>
                    <form class="form-container" create-cloud-form>
                        <div class="form-row">
                            <div class="form-row-inline">
                                <input type="text" placeholder="Cloud's name" maxlength="13"
                                    class="form-field" title="Default: cloud" 
                                    name="cloudsName" clouds-name-field />
                                <button type="submit" class="form-button">
                                    <i class="fas fa-chevron-circle-right"></i>
                                </button>
                            </div>

                            <div class="help-block"></div>
                        </div>
                    </form>
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
    <script src="<?= Project::baseUrl(); ?>js/createCloud.js"></script>
    <script>
        document.querySelector("[home-link]").classList.add('active')

        $("[other-clouds-click]").click(function() {
            $(this).find('ul').slideToggle(200)
        })
    </script>
</body>
</html>