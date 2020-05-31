<h1 class="header-logo">
    <a href="<?= Project::baseUrlPhp(); ?>">
        <i class="fas fa-cloud"></i> &nbsp;File Manager
    </a>
</h1>

<nav class="header-nav">
    <ul class="header-nav-list">
        <li class="header-nav-list-item" home-link>
            <a href="<?= Project::baseUrlPhp(); ?>">
                Home
            </a>
        </li>
        <li class="header-nav-list-item" cloud-link>
            <a href="#">
                Cloud &nbsp;<i class="fas fa-angle-down"></i>

                <ul class="header-nav-list-dropdown" all-folders-list>
                    <li class="header-nav-list-dropdown-item no-cursor">
                        <i class="fa fa-circle-notch fa-spin"></i> &nbsp;Loading...
                    </li>
                </ul>
            </a>
        </li>
    </ul>
</nav>