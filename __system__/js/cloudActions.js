const directoryFunctions = () => {
    $("[span-show-content]").click(function() {
        if ($("[input-rename-folder]").length === 0 && $("[input-rename-file]").length === 0) {
            const directory = $(this).attr('directory')
            showDirectoryContent(directory)
        }
    })

    $("[span-rename-folder]").click(function() {
        if ($("[input-rename-folder]").length === 0 && $("[input-rename-file]").length === 0) {
            const directory = $(this).parent().attr('directory')
            const directoryArray = directory.split('/')
            const nameFolder = directoryArray[directoryArray.length - 1]
            const parentLi = $(this).parent()

            parentLi.html(`
                <form form-rename-folder>
                    <i class="fas fa-folder"></i> &nbsp;&nbsp;&nbsp;<input input-rename-folder class="no-body-input" value="${nameFolder}" type="text" /> &nbsp;&nbsp;&nbsp;&nbsp;
                </form>

                <span span-cancel-rename title="Cancel this action">
                    <i style="font-size:8pt;" class="fas fa-minus"></i>
                </span>
            `)
            $("[input-rename-folder]").focusTextToEnd()
            $("#my-error-modal").slideToggle()

            finishRenameFolder()
        } else {
            $("[input-rename-folder]").focusTextToEnd()
        }

        return false
    })

    $("[span-delete-folder]").click(function() {
        const directoryParent = document.querySelector("[input-directory-path]").value
        const directory = $(this).parent().attr('directory')
        const directoryArray = directory.split('/')
        const nameFolder = directoryArray[directoryArray.length - 1]

        Swal.fire({
            title: "Are you sure about deleting this folder?",
            html: `
                It's irreversible!<br/>
                Folder to delete: ${nameFolder}
            `,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffd34e",
            confirmButtonText: "Yes, delete it",
            cancelButtonColor: "#999",
            cancelButtonText: "Cancel"
        }).then((result) => {
                if (result.value) {
                    $("[progress-msg]").html(`<i class="fa fa-circle-notch fa-spin"></i> &nbsp;Realizing the exclusion...`)
                    $(".show-progress-modal p").remove()
                    $('[progress-div]').css({'width': '0%'})
                    $('[progress-div]').html('0%')

                    $.ajax({
                        dataType: 'json',
                        type: 'post',
                        url: BASE_URL + 'api/cloudManager',
                        data: `folderDelete=${directory}`,
                        beforeSend: function() {
                            $("#my-progress-modal").show()
                        },
                        success: function(json) {
                            $("[progress-msg]").html(`We finished it!`)

                            if (json['status']) {
                                $(".show-progress-modal").append(`
                                    <p align="center">
                                        The <b>${nameFolder}</b> folder has been deleted successfully!
                                    </p>
                                `)
                            } else {
                                $(".show-progress-modal").append(`
                                    <p align="center">
                                        The <b>${nameFolder}</b> folder don't exist or was deleted!
                                    </p>
                                `)
                            }
                        },
                        error: function(json) {
                            $("[progress-msg]").html(`An error occurred!`)
                            $(".show-progress-modal").append(`
                                <p align="center">
                                    An unexpected error occurred at server!<br/>
                                    <small>We're working to fix it.</small>
                                </p>
                            `)
                        },
                        xhr: function() {  // Custom XMLHttpRequest
                            var myXhr = $.ajaxSettings.xhr()

                            if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
                                myXhr.upload.addEventListener('progress', function (e) {
                                    if (e.lengthComputable) {
                                        let load = ((e.loaded / e.total) * 100) + '%'
                                        let loadFix = ((e.loaded / e.total) * 100).toFixed(0) + '%'

                                        $('[progress-div]').css({'width': load})
                                        $('[progress-div]').html(loadFix)
                                    }
                                }, false)
                            }

                            return myXhr
                        }
                    }).done(function() {
                        showDirectoryContent(directoryParent)
                    })
                }
            })
        return false
    })

    $("[span-show-image]").click(function() {
        const path = `${ROOT_CLOUD2}${$(this).parent().attr('path')}`
        $("[img-path]").html(loadingRes())
        $("#my-view-image-modal").show()

        $("[img-view]").attr('src', path)
        $("[img-path]").html(`<b>Path:</b> ${$(this).parent().attr('path')}`)
    })

    $("[span-download-file]").click(function() {
        const path = $(this).parent().attr('path')

        Toast.fire({
            title: loadingRes(`Wait a few seconds, please...`)
        })

        $('body').append(`
            <form form-download target="_blank" action="${BASE_URL}api/fileDownload" method="post">
                <input type="hidden" name="fileDownload" value="${path}" />
            </form>
        `)
        $("[form-download]").submit()

        setTimeout(() => {
            $("[form-download]").remove()
        }, 1500)
    })

    $("[span-rename-file]").click(function() {
        if ($("[input-rename-file]").length === 0 && $("[input-rename-folder]").length === 0) {
            const path = $(this).parent().attr('path')
            const pathArray = path.split('/')
            const nameFile = pathArray[pathArray.length - 1]

            const parentLi = $(this).parent()
            const liIcon = parentLi.find('i')[0].className

            parentLi.html(`
                <form form-rename-file>
                    <i class="${liIcon}"></i> &nbsp;&nbsp;&nbsp;<input input-rename-file class="no-body-input" value="${nameFile}" type="text" /> &nbsp;&nbsp;&nbsp;&nbsp;
                </form>

                <span span-cancel-rename title="Cancel this action">
                    <i style="font-size:8pt;" class="fas fa-minus"></i>
                </span>
            `)
            $("[input-rename-file]").focusTextToEnd()
            
            $("#my-error-modal").slideToggle()

            finishRenameFile()
        } else {
            $("[input-rename-file]").focusTextToEnd()
        }
    })

    $("[span-delete-file]").click(function() {
        const path = $(this).parent().attr('path')
        const pathArray = path.split('/')
        const nameFile = pathArray[pathArray.length - 1]
        const directoryParent = document.querySelector("[input-directory-path]").value

        Swal.fire({
            title: "Are you sure about deleting this file?",
            html: `
                It's irreversible!<br/>
                File to delete: ${nameFile}
            `,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffd34e",
            confirmButtonText: "Yes, delete it",
            cancelButtonColor: "#999",
            cancelButtonText: "Cancel"
        }).then((result) => {
                if (result.value) {
                    $("[progress-msg]").html(`<i class="fa fa-circle-notch fa-spin"></i> &nbsp;Realizing the exclusion...`)
                    $(".show-progress-modal p").remove()
                    $('[progress-div]').css({'width': '0%'})
                    $('[progress-div]').html('0%')

                    $.ajax({
                        dataType: 'json',
                        type: 'post',
                        url: BASE_URL + 'api/cloudManager',
                        data: `fileDelete=${path}`,
                        beforeSend: function() {
                            $("#my-progress-modal").show()
                        },
                        success: function(json) {
                            $("[progress-msg]").html(`We finished it!`)

                            if (json['status']) {
                                $(".show-progress-modal").append(`
                                    <p align="center">
                                        The <b>${nameFile}</b> file has been deleted successfully!
                                    </p>
                                `)
                            } else {
                                $(".show-progress-modal").append(`
                                    <p align="center">
                                        The <b>${nameFile}</b> file don't exist or was deleted!
                                    </p>
                                `)
                            }
                        },
                        error: function(json) {
                            $("[progress-msg]").html(`An error occurred!`)
                            $(".show-progress-modal").append(`
                                <p align="center">
                                    An unexpected error occurred at server!<br/>
                                    <small>We're working to fix it.</small>
                                </p>
                            `)
                        },
                        xhr: function() {  // Custom XMLHttpRequest
                            var myXhr = $.ajaxSettings.xhr()

                            if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
                                myXhr.upload.addEventListener('progress', function (e) {
                                    if (e.lengthComputable) {
                                        let load = ((e.loaded / e.total) * 100) + '%'
                                        let loadFix = ((e.loaded / e.total) * 100).toFixed(0) + '%'

                                        $('[progress-div]').css({'width': load})
                                        $('[progress-div]').html(loadFix)
                                    }
                                }, false)
                            }

                            return myXhr
                        }
                    }).done(function() {
                        showDirectoryContent(directoryParent)
                    })
                }
            })
    })
}

const finishRenameFolder = () => {
    $("[span-cancel-rename]").click(function(e) {
        e.preventDefault()
        const directoryParent = document.querySelector("[input-directory-path]").value
        showDirectoryContent(directoryParent)
        $("#my-error-modal").slideToggle()
    })

    $("[form-rename-folder]").submit(function() {
        const oldFolder = $(this).parent().attr('directory')
        const inputVal = $("[input-rename-folder]").val()

        if (inputVal.length > 0) {
            saveFolder(inputVal, oldFolder, true)
            $("#my-error-modal").slideToggle()
        }

        return false
    })
}

const finishRenameFile = () => {
    $("[span-cancel-rename]").click(function(e) {
        e.preventDefault()
        const directoryParent = document.querySelector("[input-directory-path]").value
        showDirectoryContent(directoryParent)
        $("#my-error-modal").slideToggle()
    })

    $("[form-rename-file]").submit(function() {
        const oldFile = $(this).parent().attr('path')
        const newFile = $("[input-rename-file]").val()

        if (newFile.length > 0) {
            saveFile(oldFile, newFile)
            $("#my-error-modal").slideToggle()
        }

        return false
    })
}

const saveFile = (oldFile, newFile) => {
    const directory = document.querySelector("[input-directory-path]").value

    $.ajax({
        dataType: 'json',
        type: 'post',
        url: BASE_URL + 'api/cloudManager',
        data: `oldFile=${oldFile}&newFile=${newFile}` ,
        beforeSend: function() {
            Toast.fire({
                title: loadingRes(`Saving...`)
            })
        },
        success: function(json) {
            if (+json['status'] === 1) {
                Toast.fire({
                    type: 'success',
                    html: `The <b>${json['newFileName']}</b> file has been save successfully!`
                })
            } else {
                Toast.fire({
                    type: 'error',
                    html: `An error occurred to save <b>${newFile}</b> file!`
                })
            }
        },
        error: function(json) {
            Toast.fire({
                type: 'error',
                html: `An unexpected error occurred at the server!`
            })
        }
    }).done(function() {
        showDirectoryContent(directory)
    })
}

const cloudLeftDiv = () => {
    $("[func-cloud='add']").click(function(e) {
        e.preventDefault()

        if ($("[input-add-folder]").length === 0) {
            const writeUl = $("[write-directory]")[0]
            writeUl.insertAdjacentHTML('afterbegin', `
                <li>
                    <form form-add-folder>
                        <i class="fas fa-folder"></i> &nbsp;&nbsp;&nbsp;<input input-add-folder class="no-body-input" type="text" /> &nbsp;&nbsp;&nbsp;&nbsp;
                    </form>

                    <span span-cancel-add title="Cancel this action">
                        <i style="font-size:8pt;" class="fas fa-minus"></i>
                    </span> 
                </li>
            `)
            $("[input-add-folder]").focus()
            $("#my-error-modal").slideToggle()

            finishAddFolder()
        } else {
            $("[input-add-folder]").focus()
        }
    })

    $("[func-cloud='clear']").click(function(e) {
        e.preventDefault()
        const directory = document.querySelector("[input-directory-path]").value
        const directoryArray = directory.split('/')
        const nameFolder = directoryArray[directoryArray.length - 1]

        Swal.fire({
            title: "Are you sure about cleaning this folder?",
            html: `
                It's irreversible!<br/>
                Folder to clear: ${nameFolder}
            `,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffd34e",
            confirmButtonText: "Yes, clear it",
            cancelButtonColor: "#999",
            cancelButtonText: "Cancel"
        }).then((result) => {
                if (result.value) {
                    $("[progress-msg]").html(`<i class="fa fa-circle-notch fa-spin"></i> &nbsp;Realizing the cleaning`)
                    $(".show-progress-modal p").remove()
                    $('[progress-div]').css({'width': '0%'})
                    $('[progress-div]').html('0%')

                    $.ajax({
                        dataType: 'json',
                        type: 'post',
                        url: BASE_URL + 'api/cloudManager',
                        data: `folderClear=${directory}`,
                        beforeSend: function() {
                            $("#my-progress-modal").show()
                        },
                        success: function(json) {
                            $("[progress-msg]").html(`We finished it!`)

                            if (json['status']) {
                                $(".show-progress-modal").append(`
                                    <p align="center">
                                        The <b>${nameFolder}</b> folder has been cleared successfully!
                                    </p>
                                `)
                            } else {
                                $(".show-progress-modal").append(`
                                    <p align="center">
                                        The <b>${nameFolder}</b> folder don't exist!
                                    </p>
                                `)
                            }
                        },
                        error: function(json) {
                            $("[progress-msg]").html(`An error occurred!`)
                            $(".show-progress-modal").append(`
                                <p align="center">
                                    An unexpected error occurred at server!<br/>
                                    <small>We're working to fix it.</small>
                                </p>
                            `)
                        },
                        xhr: function() {  // Custom XMLHttpRequest
                            var myXhr = $.ajaxSettings.xhr()

                            if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
                                myXhr.upload.addEventListener('progress', function (e) {
                                    if (e.lengthComputable) {
                                        let load = ((e.loaded / e.total) * 100) + '%'
                                        let loadFix = ((e.loaded / e.total) * 100).toFixed(0) + '%'

                                        $('[progress-div]').css({'width': load})
                                        $('[progress-div]').html(loadFix)
                                    }
                                }, false)
                            }

                            return myXhr
                        }
                    }).done(function() {
                        showDirectoryContent(directory)
                    })
                }
            })
    })

    $("[upload-files]").change(function() {
        const input = $(this)
        const inputFile = $(this).get(0).files

        if (parseInt(inputFile.length) <= 10) {

            $("[progress-msg]").html(`<i class="fa fa-circle-notch fa-spin"></i> &nbsp;Realizing the uploading`)
            $(".show-progress-modal p").remove()
            $('[progress-div]').css({'width': '0%'})
            $('[progress-div]').html('0%')

            const formData = new FormData(this.parentNode)
            formData.append('uploadDirectory', $("[input-directory-path]").val())

            $.ajax({
                dataType: 'json',
                type: 'post',
                url: BASE_URL + 'api/cloudUpload',
                data: formData,
                beforeSend: function() {
                    $("#my-progress-modal").show()
                },
                success: function(json) {
                    if (json['status']) {
                        $("[progress-msg]").html(`We finished it!`)

                        $(".show-progress-modal").append(`
                            <p align="center">
                                <b>Destiny folder: ${json['directory']}</b>
                                <p write-succeded-files style="font-size:8pt;line-height:23px;">
                                    <span class="green-cel" style="font-size:8pt;">Uploaded files <b>(${json['filesSucceded'].length})</b>:</span>
                                </p>
                                <p write-failed-files style="font-size:8pt;line-height:23px;">
                                    <span class="red-cel" style="font-size:8pt;">Failed files <b>(${json['filesFailed'].length})</b>:</span>
                                </p>
                            </p>
                        `)

                        if (json['filesSucceded'].length > 0) {
                            for (let i = 0; i < json['filesSucceded'].length; i++) {
                                $(".show-progress-modal [write-succeded-files]").append(`
                                    <br/>${i + 1}. Name: ${json['filesSucceded'][i].name} - Size: ${json['filesSucceded'][i].size}
                                `)
                            }
                        }

                        if (json['filesFailed'].length > 0) {
                            for (let i = 0; i < json['filesFailed'].length; i++) {
                                $(".show-progress-modal [write-failed-files]").append(`
                                    <br/>${i + 1}. Name: ${json['filesFailed'][i].name}
                                `)
                            }
                        }
                    }

                    showDirectoryContent($("[input-directory-path]").val())
                },
                error: function(json) {
                    $("[progress-msg]").html(`Ocorreu um erro!`)
                    $(".show-progress-modal").append(`
                        <p align="center">
                            The content limit has probably been exceeded!<br/>
                            <small>The uploaded files exceeded the maximum supported content</small>
                        </p>
                    `)
                    showDirectoryContent($("[input-directory-path]").val())
                },
                cache: false,
                contentType: false,
                processData: false,
                xhr: function() {  // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr()

                    if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
                        myXhr.upload.addEventListener('progress', function (e) {
                            if (e.lengthComputable) {
                                let load = ((e.loaded / e.total) * 100) + '%'
                                let loadFix = ((e.loaded / e.total) * 100).toFixed(0) + '%'

                                $('[progress-div]').css({'width': load})
                                $('[progress-div]').html(loadFix)
                            }
                        }, false)
                    }

                    return myXhr
                }
            }).done(function() {
                input.wrap('<form>').closest('form').get(0).reset()
                input.unwrap()
            })
        } else {
            Toast.fire({
                type: 'error',
                title: 'Maximum of 10 files'
            })
        }
    })

    $("[func-cloud='reload']").click(function(e) {
        e.preventDefault()

        const cloud = document.querySelector("[cloud-container]")
        cloud.innerHTML = `
            <h3 class="help-block-cloud"><i class="fa fa-circle-notch fa-spin"></i> &nbsp;Wait a few seconds, please...</h3>
        `

        getCloud(false)
    })

    $("[func-cloud='clearHistory'] i").click(function() {
        if (history.length <= 1) {
            Toast.fire({
                title: `There aren't recorded histories!`
            })
        } else {
            history = [{
                "path": ''
            }]

            if ($("[path-func]").val() !== $("[input-directory-path]").val()) {
                history.push({
                    "path": setNewHistory($("[input-directory-path]").val(), true)
                })
            }

            currentHistory = history.length - 1

            checkHistory()
            Toast.fire({
                type: 'success',
                title: 'The history has been cleared successfully!'
            })
        }
    })
}

const finishAddFolder = () => {
    $("[span-cancel-add]").click(function(e) {
        e.preventDefault()
        $(this).parent().remove()
        $("#my-error-modal").slideToggle()
    })

    $("[form-add-folder]").submit(function() {
        const inputVal = $("[input-add-folder]").val()
        if (inputVal.length > 0) {
            if (inputVal.indexOf('/') > -1) {
                Toast.fire({
                    type: 'error',
                    title: `/ (slash) isn't accepted as character`
                })
            } else {
                saveFolder(inputVal)
                $("#my-error-modal").slideToggle()
            }
        }

        return false
    })
}

const saveFolder = (nameFolder, oldFolder = null, upload = false) => {
    const directory = document.querySelector("[input-directory-path]").value
    const data = upload 
        ? `folderRename=${oldFolder}&newFolder=${nameFolder}` 
        : `folderAdd=${nameFolder}&directory=${directory}`

    $.ajax({
        dataType: 'json',
        type: 'post',
        url: BASE_URL + 'api/cloudManager',
        data: data,
        beforeSend: function() {
            Toast.fire({
                title: loadingRes(`Saving...`)
            })
        },
        success: function(json) {
            if (+json['status'] === 1) {
                Toast.fire({
                    type: 'success',
                    html: `The <b>${json['nameFolder']}</b> folder has been saved successfully!`
                })
            } else {
                Toast.fire({
                    type: 'error',
                    html: `An error occurred to save <b>${nameFolder}</b> folder!`
                })
            }
        },
        error: function(json) {
            Toast.fire({
                type: 'error',
                html: `An error occurred at server!`
            })
        }
    }).done(function() {
        showDirectoryContent(directory)
    })
}

const reloadCurrentFolder = () => {
    $("[reload-folder]").click(function() {
        const directory = $(this).attr('directory')
        const parentUl = $(this).parent()

        if (directory !== "" && parentUl.length > 0) {
            showDirectoryContent(directory)
        }
    })
}

const shortcutDirectory = () => {
    $("[show-content]").click(function() {
        showDirectoryContent($(this).attr('show-content'))
    })
}