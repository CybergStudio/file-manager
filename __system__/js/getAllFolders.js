const getAllFolders = () => {
    setTimeout(() => {
        $.ajax({
            dataType: 'json',
            url: `${BASE_URL}api/getAllFolders`,
            success: function(json) {
                if (json['status']) {
                    $("[all-folders-list]").html(``)
                    $("[other-clouds-list]").html(``)

                    if (json['folder'].length > 0) {
                        json['folder'].forEach((e, i) => {
                            $("[all-folders-list]").append(`
                                <a href="${BASE_URL}cloud/${e.name}">
                                    <li class="header-nav-list-dropdown-item">
                                        ${e.name}
                                    </li>
                                </a>
                            `)
                            $("[other-clouds-list]").append(`
                                <a href="${BASE_URL}cloud/${e.name}">
                                    <li class="other-clouds-list-dropdown-item">
                                        ${e.name}
                                    </li>
                                </a>
                            `)
                        })
                    } else {
                        $("[all-folders-list]").html(`
                            <li class="header-nav-list-dropdown-item no-cursor">
                                There aren't other clouds.
                            </li>
                        `)
                        $("[other-clouds-list]").append(`
                            <li class="other-clouds-list-dropdown-item no-cursor">
                                There aren't other clouds.
                            </li>
                        `)
                    }

                } else {
                    Toast.fire({
                        type: 'error',
                        title: json['error'] || 'An unexpected error occurred.'
                    })
                }
            },
            error: function() {
                Toast.fire({
                    type: 'error',
                    title: 'An unexpected error occurred.'
                })
            }
        })
    }, 2000)
}

getAllFolders()