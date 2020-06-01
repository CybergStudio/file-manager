<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Page not found - File Manager</title>
    
    <link rel="stylesheet" type="text/css" 
        media="screen" href="<?= Project::baseUrl(); ?>assets/css/minified-main.css" />
    <link href="<?= Project::baseUrl(); ?>libs/fontawesome-free-5.8.0-web/css/all.css"
        rel="stylesheet" />
</head>
<body>
    <div class="l-wrapper">
        <div class="l-header">
            <?php include('__system__/includes/header.php'); ?>
        </div>
        <div class="l-main">
            
            <div class="error-404">
                <h3>
                    Error 404<br/>
                    Whoops. Page not found!
                </h3>
                <p>
                    The URL solicited don't exist or was deleted.
                </p>
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
    <script>
        $("[other-clouds-click]").click(function() {
            $(this).find('ul').slideToggle(200)
        })
    </script>
</body>
</html>