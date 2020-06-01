$("[clouds-name-field]").keyup(function() {
    const inputVal = $(this).val().trim()
    const data = new FormData()
    data.append('validateName', inputVal)
    const helpBlock = clearAndGetHelpBlock()

    if (inputVal.length) {
        $.ajax({
            dataType: 'json',
            type: 'post',
            data: data,
            url: `${BASE_URL}api/createCloud`,
            beforeSend: function() {
                helpBlock.innerHTML = loadingResSmall()
            },
            success: function(json) {
                if (json['status']) {
                    helpBlock.classList.add('success')
                    helpBlock.innerHTML = `<i class="fas fa-check-circle"></i> &nbsp;${json['cloudsName'] || 'It'} is a valid name`
                } else {
                    helpBlock.classList.add('error')
                    helpBlock.innerHTML = `
                        <i class="fas fa-exclamation-circle"></i> &nbsp;${json['error']}
                    `
                }
            },
            error: function() {
                Toast.fire({
                    type: 'error',
                    title: 'An unexpected error occurred.'
                })
            },
            cache: false,
            contentType: false,
            processData: false
        })
    }
})

$("[create-cloud-form]").submit(function(e) {
    e.preventDefault()

    const data = new FormData(this)
    const helpBlock = clearAndGetHelpBlock()

    $.ajax({
        dataType: 'json',
        type: 'post',
        data: data,
        url: `${BASE_URL}api/createCloud`,
        beforeSend: function() {
            helpBlock.innerHTML = loadingResSmall()
        },
        success: function(json) {
            if (json['status']) {
                helpBlock.classList.add('success')
                helpBlock.innerHTML = `<i class="fas fa-check-circle"></i> &nbsp;${json['cloudsName']} was successfully created`
                Toast.fire({
                    title: loadingRes(`Wait a few seconds, please...`)
                })

                location.href = `${ROOT_CLOUD + json['cloudsName']}`
            } else {
                helpBlock.classList.add('error')
                helpBlock.innerHTML = `<i class="fas fa-check-circle"></i> &nbsp;${json['error']}`

            }
        },
        error: function() {
            Toast.fire({
                type: 'error',
                title: 'An unexpected error occurred.'
            })
        },
        cache: false,
        contentType: false,
        processData: false
    })
})