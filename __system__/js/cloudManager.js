let history = [{
    "path": ''
}]
let currentHistory = 0

$(document).ready(function() {
    var modal = document.getElementById('myModalProgress');
    var modal2 = document.getElementById('myModalViewImage');
    var span = document.getElementsByClassName("closeModalProgress")[0];
    var span2 = document.getElementsByClassName("closeModalProgress")[1];
    
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    span2.onclick = function() {
        modal2.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        } else if (event.target == modal2) {
            modal2.style.display = "none";
        } 
    }
})

const checkHistory = () => {
    if (history.length <= 1) {
        $("[backward-arrow]").css({
            'pointer-events': 'none',
            'color': '#fff3'
        })
        $("[forward-arrow]").css({
            'pointer-events': 'none',
            'color': '#fff3'
        })
    } else {
        if (+currentHistory > 0) {
            $("[backward-arrow]").css({
                'pointer-events': 'auto',
                'color': '#fff'
            })
        } else {
            $("[backward-arrow]").css({
                'pointer-events': 'none',
                'color': '#fff3'
            })
        }

        if ((+currentHistory + 1) < history.length) {
            $("[forward-arrow]").css({
                'pointer-events': 'auto',
                'color': '#fff'
            })
        } else {
            $("[forward-arrow]").css({
                'pointer-events': 'none',
                'color': '#fff3'
            })
        }
    }
}

const getNuvem = (delay = true, folderByHistory = '') => {
    const timeout = delay ? 2000 : 10;
    const nuvem = document.querySelector("[write-nuvem]")
    const pathFunc = $("[path-func]").val()

    setTimeout(() => {
        $.ajax({
            dataType: 'json',
            type: 'post',
            data: `getNuvem=${pathFunc + folderByHistory}`,
            url: `${BASE_URL}functions/gerenciaNuvem`,
            beforeSend: function() {
                nuvem.firstElementChild.innerHTML = `
                    <h3 class="help-block-resp">${loadingRes('')}</h3>
                `
            },
            success: function(json) {
                if (+json['status'] === 3) {

                    const folder = folderByHistory !== '' ? folderByHistory : pathFunc
                    Toast.fire({
                        type: 'error',
                        title: `A pasta ${folder} não foi encontrada!`
                    })
                    getNuvem(false)

                } else if (json['status']) {

                    writeBase(pathFunc + folderByHistory)

                    writeCurrentFolder(pathFunc + folderByHistory)
                    writeDirectoryUl(json['nuvem']['folder'], json['nuvem']['file'])

                } else {
                    
                    nuvem.firstElementChild.innerHTML = `
                        <h3 class="help-block-resp">${json['error']}</h3>
                    `

                }
            },
            error: function(json) {
                nuvem.firstElementChild.innerHTML = `
                    <h3 class="help-block-resp">Um erro inesperado ocorreu</h3>
                `
            }
        })
    }, timeout)
}

const writeBase = (pathFunc) => {
    const nuvem = document.querySelector("[write-nuvem]")

    nuvem.innerHTML = `
            <div class="funcNuvem">
                <span title="Adicionar pasta" class="cloudMainButtons" func-nuvem="add"><i class="fas fa-folder-plus"></i></span>
                <span title="Limpar a pasta" class="cloudMainButtons" func-nuvem="clear"><i class="fas fa-folder-minus"></i></span>

                <span title="Carregar arquivos" class="cloudMainButtons" func-nuvem="up">
                    <label style="cursor:pointer;" for="upload-files">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </label>
                </span>

                <form style="position:absolute;" form-upload enctype="multipart/form-data">
                    <input name="upload[]" id="upload-files" upload-files type="file" multiple />
                </form>

                <span title="Recarregar a nuvem" class="cloudMainButtons" func-nuvem="reload"><i class="fas fa-redo"></i></span>

                <span title="Limpar o histórico" class="cloudMainButtons" func-nuvem="clearHistory"><i class="fas fa-trash-alt"></i></span>
                
                <input style="position:absolute;" type="hidden" input-directory-path />
            </div>
            <div class="linksNuvem clearfix">
                <div class="cloudTopTaskBarDiv">
                    <div class="arrowPathTravelDiv">
                        <span title="Voltar" backward-arrow><i class="fas fa-arrow-left"></i></span>
                        <span title="Avançar" forward-arrow><i class="fas fa-arrow-right"></i></span>
                    </div>
                    <h1 class="cloudDivTitle"><i class="fas fa-cloud"></i> Nuvem</h1>
                </div>
                <div class="folderPathDiv" directory-path class="directoryPath">Caminho das Pastas:<span></span></div>
                <ul class="folderLinksListDiv" write-links></ul>
                <ul class="writeDirectoryDiv" write-directory></ul>
            </div>
    `

    
    document.querySelector("[write-links]").onselectstart = new Function('return false') 
    
    checkHistory()
    writeDirectoryPath(pathFunc)
    funcNuvem()
    navigatorArrows()
}

const writeDirectoryUl = (folders, files) => {
    const writeUl = document.querySelector('[write-directory]')
    writeUl.innerHTML = ''
    const directory = document.querySelector("[input-directory-path]").value

    if (folders.length > 0 || files.length > 0) {
        folders.forEach((e, i) => {
            writeUl.insertAdjacentHTML(
                'beforeend', `
                    <li class="listForHover" span-show-content directory="${directory}/${e.name}">
                        <i class="${e.icon}"></i> &nbsp;&nbsp;&nbsp;${e.name} &nbsp;&nbsp;&nbsp;
                        <i class="${e.empty ? `grayCircle` : `redCircle` }" title="${e.empty ? `Pasta vazia` : `Pasta com conteúdo` }"></i>
                        
                        <btn class="btnLinks" span-rename-folder title="Renomeie esta pasta">
                            <i class="fas fa-edit"></i>
                        </btn> 
                        <btn class="btnLinks" span-delete-folder title="Exclua esta pasta">
                            <i class="fas fa-trash-alt"></i>
                        </btn>
                    </li>
                `
            )
        })
    
        files.forEach((e, i) => {
            writeUl.insertAdjacentHTML(
                'beforeend', `
                    <li path="${directory}/${e.name}">
                        <i class="${e.icon}"></i> &nbsp;&nbsp;&nbsp;${e.name} &nbsp;&nbsp;&nbsp;&nbsp;
    
                        ${(e.isImage) ? `
                            <span span-show-image title="Visualize esta imagem">
                                <i style="font-size:8pt;" class="fas fa-eye"></i>
                            </span>
                        ` : ``}
    
                        <span span-download-file title="Baixe este arquivo">
                            <i class="fas fa-download"></i>
                        </span>
                        <span span-rename-file title="Renomeie este arquivo">
                            <i class="fas fa-edit"></i>
                        </span>
                        <span span-delete-file title="Exclua este arquivo">
                            <i class="fas fa-trash-alt"></i>
                        </span>
                    </li>
                `
            )
        })

        directoryFunctions()
    } else {
        writeUl.innerHTML = `<li>Esta pasta está vazia, até o momento.</li>`
    }
}

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
                    <i class="fas fa-folder"></i> &nbsp;&nbsp;&nbsp;<input input-rename-folder class="inputNoBody" value="${nameFolder}" type="text" /> &nbsp;&nbsp;&nbsp;&nbsp;
                </form>

                <span span-cancel-rename title="Cancele a renomeação desta pasta">
                    <i style="font-size:8pt;" class="fas fa-minus"></i>
                </span>
            `)
            $("[input-rename-folder]").focusTextToEnd()
            $("#myModalError").slideToggle()

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
            title: "Deseja mesmo excluir este pasta?",
            html: `
                Uma vez feito, não há volta!<br/>
                Pasta à excluir: ${nameFolder}
            `,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffd34e",
            confirmButtonText: "Sim, excluir",
            cancelButtonColor: "#999",
            cancelButtonText: "Cancelar"
        }).then((result) => {
                if (result.value) {
                    $("[msg-progress]").html(`<i class="fa fa-circle-notch fa-spin"></i> &nbsp;Realizando a exclusão`)
                    $(".showModalProgress p").remove()
                    $('[div-progress]').css({'width': '0%'})
                    $('[div-progress]').html('0%')

                    $.ajax({
                        dataType: 'json',
                        type: 'post',
                        url: BASE_URL + 'functions/gerenciaNuvem',
                        data: `folderDelete=${directory}`,
                        beforeSend: function() {
                            $("#myModalProgress").show()
                        },
                        success: function(json) {
                            $("[msg-progress]").html(`Terminanos a ação!`)

                            if (json['status']) {
                                $(".showModalProgress").append(`
                                    <p align="center">
                                        Pasta <b>${nameFolder}</b> foi excluída com sucesso!
                                    </p>
                                `)
                            } else {
                                $(".showModalProgress").append(`
                                    <p align="center">
                                        Pasta <b>${nameFolder}</b> não existe ou já foi excluida!
                                    </p>
                                `)
                            }
                        },
                        error: function(json) {
                            $("[msg-progress]").html(`Ocorreu um erro!`)
                            $(".showModalProgress").append(`
                                <p align="center">
                                    Um erro inesperado ocorreu no servidor!<br/>
                                    <small>Estamos trabalhando para consertá-lo</small>
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

                                        $('[div-progress]').css({'width': load})
                                        $('[div-progress]').html(loadFix)
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
        const path = `${BASE_URL2}nuvem${$(this).parent().attr('path')}`
        $("[img-path]").html(loadingRes())
        $("#myModalViewImage").show()

        $("[img-view]").attr('src', path)
        $("[img-path]").html(`<b>Caminho:</b> ${$(this).parent().attr('path')}`)
    })

    $("[span-download-file]").click(function() {
        const path = $(this).parent().attr('path')

        Toast.fire({
            title: loadingRes(`Aguarde uns instantes, por favor...`)
        })

        $('body').append(`
            <form form-download target="_blank" action="${BASE_URL}functions/gerenciaNuvem" method="post">
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
                    <i class="${liIcon}"></i> &nbsp;&nbsp;&nbsp;<input input-rename-file class="inputNoBody" value="${nameFile}" type="text" /> &nbsp;&nbsp;&nbsp;&nbsp;
                </form>

                <span span-cancel-rename title="Cancele a renomeação desta pasta">
                    <i style="font-size:8pt;" class="fas fa-minus"></i>
                </span>
            `)
            $("[input-rename-file]").focusTextToEnd()
            
            $("#myModalError").slideToggle()

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
            title: "Deseja mesmo excluir este arquivo?",
            html: `
                Uma vez feito, não há volta!<br/>
                Arquivo à excluir: ${nameFile}
            `,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffd34e",
            confirmButtonText: "Sim, excluir",
            cancelButtonColor: "#999",
            cancelButtonText: "Cancelar"
        }).then((result) => {
                if (result.value) {
                    $("[msg-progress]").html(`<i class="fa fa-circle-notch fa-spin"></i> &nbsp;Realizando a exclusão`)
                    $(".showModalProgress p").remove()
                    $('[div-progress]').css({'width': '0%'})
                    $('[div-progress]').html('0%')

                    $.ajax({
                        dataType: 'json',
                        type: 'post',
                        url: BASE_URL + 'functions/gerenciaNuvem',
                        data: `fileDelete=${path}`,
                        beforeSend: function() {
                            $("#myModalProgress").show()
                        },
                        success: function(json) {
                            $("[msg-progress]").html(`Terminanos a ação!`)

                            if (json['status']) {
                                $(".showModalProgress").append(`
                                    <p align="center">
                                        Arquivo <b>${nameFile}</b> foi excluído com sucesso!
                                    </p>
                                `)
                            } else {
                                $(".showModalProgress").append(`
                                    <p align="center">
                                        Arquivo <b>${nameFile}</b> não existe ou já foi excluido!
                                    </p>
                                `)
                            }
                        },
                        error: function(json) {
                            $("[msg-progress]").html(`Ocorreu um erro!`)
                            $(".showModalProgress").append(`
                                <p align="center">
                                    Um erro inesperado ocorreu no servidor!<br/>
                                    <small>Estamos trabalhando para consertá-lo</small>
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

                                        $('[div-progress]').css({'width': load})
                                        $('[div-progress]').html(loadFix)
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
        $("#myModalError").slideToggle()
    })

    $("[form-rename-folder]").submit(function() {
        const oldFolder = $(this).parent().attr('directory')
        const inputVal = $("[input-rename-folder]").val()

        if (inputVal.length > 0) {
            saveFolder(inputVal, oldFolder, true)
            $("#myModalError").slideToggle()
        }

        return false
    })
}

const finishRenameFile = () => {
    $("[span-cancel-rename]").click(function(e) {
        e.preventDefault()
        const directoryParent = document.querySelector("[input-directory-path]").value
        showDirectoryContent(directoryParent)
        $("#myModalError").slideToggle()
    })

    $("[form-rename-file]").submit(function() {
        const oldFile = $(this).parent().attr('path')
        const newFile = $("[input-rename-file]").val()

        if (newFile.length > 0) {
            saveFile(oldFile, newFile)
            $("#myModalError").slideToggle()
        }

        return false
    })
}

const saveFile = (oldFile, newFile) => {
    const directory = document.querySelector("[input-directory-path]").value

    $.ajax({
        dataType: 'json',
        type: 'post',
        url: BASE_URL + 'functions/gerenciaNuvem',
        data: `oldFile=${oldFile}&newFile=${newFile}` ,
        beforeSend: function() {
            Toast.fire({
                title: loadingRes(`Salvando...`)
            })
        },
        success: function(json) {
            if (+json['status'] === 1) {
                Toast.fire({
                    type: 'success',
                    html: `Arquivo <b>${json['newFileName']}</b> foi salvo com sucesso!`
                })
            } else {
                Toast.fire({
                    type: 'error',
                    html: `Ocorreu um erro ao salvar o arquivo <b>${newFile}</b>!`
                })
            }
        },
        error: function(json) {
            Toast.fire({
                type: 'error',
                html: `Um erro inesperado ocorreu no servidor!`
            })
        }
    }).done(function() {
        showDirectoryContent(directory)
    })
}

const funcNuvem = () => {
    $("[func-nuvem='add']").click(function(e) {
        e.preventDefault()

        if ($("[input-add-folder]").length === 0) {
            const writeUl = $("[write-directory]")[0]
            writeUl.insertAdjacentHTML('afterbegin', `
                <li>
                    <form form-add-folder>
                        <i class="fas fa-folder"></i> &nbsp;&nbsp;&nbsp;<input input-add-folder class="inputNoBody" type="text" /> &nbsp;&nbsp;&nbsp;&nbsp;
                    </form>

                    <span span-cancel-add title="Cancele a adição desta pasta">
                        <i style="font-size:8pt;" class="fas fa-minus"></i>
                    </span> 
                </li>
            `)
            $("[input-add-folder]").focus()
            $("#myModalError").slideToggle()

            finishAddFolder()
        } else {
            $("[input-add-folder]").focus()
        }
    })

    $("[func-nuvem='clear']").click(function(e) {
        e.preventDefault()
        const directory = document.querySelector("[input-directory-path]").value
        const directoryArray = directory.split('/')
        const nameFolder = directoryArray[directoryArray.length - 1]

        Swal.fire({
            title: "Deseja mesmo limpar este pasta?",
            html: `
                Uma vez feito, não há volta!<br/>
                Pasta à limpar: ${nameFolder}
            `,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffd34e",
            confirmButtonText: "Sim, limpar",
            cancelButtonColor: "#999",
            cancelButtonText: "Cancelar"
        }).then((result) => {
                if (result.value) {
                    $("[msg-progress]").html(`<i class="fa fa-circle-notch fa-spin"></i> &nbsp;Realizando a limpeza`)
                    $(".showModalProgress p").remove()
                    $('[div-progress]').css({'width': '0%'})
                    $('[div-progress]').html('0%')

                    $.ajax({
                        dataType: 'json',
                        type: 'post',
                        url: BASE_URL + 'functions/gerenciaNuvem',
                        data: `folderClear=${directory}`,
                        beforeSend: function() {
                            $("#myModalProgress").show()
                        },
                        success: function(json) {
                            $("[msg-progress]").html(`Terminanos a ação!`)

                            if (json['status']) {
                                $(".showModalProgress").append(`
                                    <p align="center">
                                        Pasta <b>${nameFolder}</b> foi limpa com sucesso!
                                    </p>
                                `)
                            } else {
                                $(".showModalProgress").append(`
                                    <p align="center">
                                        Pasta <b>${nameFolder}</b> não existe!
                                    </p>
                                `)
                            }
                        },
                        error: function(json) {
                            $("[msg-progress]").html(`Ocorreu um erro!`)
                            $(".showModalProgress").append(`
                                <p align="center">
                                    Um erro inesperado ocorreu no servidor!<br/>
                                    <small>Estamos trabalhando para consertá-lo</small>
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

                                        $('[div-progress]').css({'width': load})
                                        $('[div-progress]').html(loadFix)
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

            $("[msg-progress]").html(`<i class="fa fa-circle-notch fa-spin"></i> &nbsp;Realizando o carregamento`)
            $(".showModalProgress p").remove()
            $('[div-progress]').css({'width': '0%'})
            $('[div-progress]').html('0%')

            const formData = new FormData(this.parentNode)
            formData.append('uploadDirectory', $("[input-directory-path]").val())

            $.ajax({
                dataType: 'json',
                type: 'post',
                url: BASE_URL + 'functions/gerenciaNuvem',
                data: formData,
                beforeSend: function() {
                    $("#myModalProgress").show()
                },
                success: function(json) {
                    if (json['status']) {
                        $("[msg-progress]").html(`Terminanos o upload!`)

                        $(".showModalProgress").append(`
                            <p align="center">
                                <b>Pasta de destino: ${json['directory']}</b>
                                <p write-succeded-files style="font-size:8pt;line-height:23px;">
                                    <span class="greenCel" style="font-size:8pt;">Arquivos carregados <b>(${json['filesSucceded'].length})</b>:</span>
                                </p>
                                <p write-failed-files style="font-size:8pt;line-height:23px;">
                                    <span class="redCel" style="font-size:8pt;">Arquivos falhados <b>(${json['filesFailed'].length})</b>:</span>
                                </p>
                            </p>
                        `)

                        if (json['filesSucceded'].length > 0) {
                            for (let i = 0; i < json['filesSucceded'].length; i++) {
                                $(".showModalProgress [write-succeded-files]").append(`
                                    <br/>${i + 1}. Nome: ${json['filesSucceded'][i].name} - Tamanho: ${json['filesSucceded'][i].size}
                                `)
                            }
                        }

                        if (json['filesFailed'].length > 0) {
                            for (let i = 0; i < json['filesFailed'].length; i++) {
                                $(".showModalProgress [write-failed-files]").append(`
                                    <br/>${i + 1}. Nome: ${json['filesFailed'][i].name}
                                `)
                            }
                        }
                    }

                    showDirectoryContent($("[input-directory-path]").val())
                },
                error: function(json) {
                    $("[msg-progress]").html(`Ocorreu um erro!`)
                    $(".showModalProgress").append(`
                        <p align="center">
                            O limite de conteúdo foi provavelmente excedido!<br/>
                            <small>Obs.: Os arquivos que foram carregados, excederam o máximo de conteúdo suportado</small>
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

                                $('[div-progress]').css({'width': load})
                                $('[div-progress]').html(loadFix)
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
                title: 'Máximo de 10 arquivos por carregamento'
            })
        }
    })

    $("[func-nuvem='reload']").click(function(e) {
        e.preventDefault()

        const nuvem = document.querySelector("[write-nuvem]")
        nuvem.innerHTML = `
            <div class="answerResp">
                <h3 class="help-block-resp"><i class="fa fa-circle-notch fa-spin"></i> &nbsp;Aguarde uns instantes, por favor...</h3>
            </div>
        `

        getNuvem(false)
    })

    $("[func-nuvem='clearHistory'] i").click(function() {
        if (history.length <= 1) {
            Toast.fire({
                title: 'Não há históricos registrados!'
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
                title: 'O histórico foi limpo!'
            })
        }
    })
}

const finishAddFolder = () => {
    $("[span-cancel-add]").click(function(e) {
        e.preventDefault()
        $(this).parent().remove()
        $("#myModalError").slideToggle()
    })

    $("[form-add-folder]").submit(function() {
        const inputVal = $("[input-add-folder]").val()
        if (inputVal.length > 0) {
            if (inputVal.indexOf('/') > -1) {
                Toast.fire({
                    type: 'error',
                    title: '/ (barra) não é aceito como caractere'
                })
            } else {
                saveFolder(inputVal)
                $("#myModalError").slideToggle()
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
        url: BASE_URL + 'functions/gerenciaNuvem',
        data: data,
        beforeSend: function() {
            Toast.fire({
                title: loadingRes(`Salvando...`)
            })
        },
        success: function(json) {
            if (+json['status'] === 1) {
                Toast.fire({
                    type: 'success',
                    html: `Pasta <b>${json['nameFolder']}</b> foi salva com sucesso!`
                })
            } else {
                Toast.fire({
                    type: 'error',
                    html: `Ocorreu um erro ao salvar a pasta <b>${nameFolder}</b>!`
                })
            }
        },
        error: function(json) {
            Toast.fire({
                type: 'error',
                html: `Um erro inesperado ocorreu no servidor!`
            })
        }
    }).done(function() {
        showDirectoryContent(directory)
    })
}

const writeCurrentFolder = (currentFolder) => {
    const currentFolderArray = currentFolder.split('/')
    const currentFolderName = currentFolderArray[currentFolderArray.length - 1]

    document.querySelector('[write-links]').innerHTML = `
        <li title="Pasta atual" class="directoryPathList" reload-folder 
            directory="${currentFolder}" display="show">
                <div class="spanFolders">
                    <i class="fas fa-folder-open"></i>
                </div>
                <div class="spanFolderName"> &nbsp;${currentFolderName}</div>
        </li>
    `
    
    $("[input-directory-path]").val(currentFolder)

    reloadCurrentFolder()
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

const writeDirectoryPath = path => {
    $("[input-directory-path]").val(path)

    let splitPath = path.split('/')
    let text = ``

    splitPath = splitPath.reduce((a, e, k) => {
        if (k >= 1) {
            directory = ``
            splitPath.forEach((el, i) => {
                if (i > 0 && i <= k) {
                    directory += `/${el}`
                }
            })

            return [...a, `<span show-content="${directory}">${e}</span>`]
        } else return ''
    }, [])

    text = ` ${splitPath.join(' • ')}`

    $("[directory-path] span").html(text)
    shortcutDirectory()
}

const shortcutDirectory = () => {
    $("[show-content]").click(function() {
        showDirectoryContent($(this).attr('show-content'))
    })
}

const showDirectoryContent = (directory) => {
    writeCurrentFolder(directory)
    const directoryArray = directory.split('/')
    const nameFolder = directoryArray[directoryArray.length - 1]

    const writeUl = $("[write-directory]")
    writeUl.html(`<li>${loadingResSmall()}</li>`)
    
    $.ajax({
        dataType: 'json',
        type: 'post',
        data: `directoryContent=${directory}`,
        url: `${BASE_URL}functions/gerenciaNuvem`,
        success: function(json) {
            if (json['status']) {
                writeDirectoryPath(directory)
                writeDirectoryUl(json['nuvem']['folder'], json['nuvem']['file'])
                setNewHistory(directory)
            } else {
                Toast.fire({
                    type: 'error',
                    title: json['error']
                })
            }
        },
        error: function(json) {
            Toast.fire({
                type: 'error',
                title: `A pasta ${nameFolder} provavelmente foi deletada ou renomeada`
            })

            writeUl.html(`<li><b style="margin-right:10px;">Dica:</b> Recarregue a nuvem</li>`)
        }
    })
}

const setNewHistory = (pathFolder, returnPath = false) => {
    let pathFolderArray = pathFolder.split('/')
    
    pathFolderArray = pathFolderArray.reduce((a, e, k) => {
        if (k >= 2) {
            return [ ...a, `/${e}` ]
        } else return ''
    }, [])

    pathFolder = pathFolderArray.length ? pathFolderArray.join('') : ''

    if (!returnPath) {
        if (pathFolder !== history[history.length - 1].path) {
            history.push({
                "path": pathFolder
            })
        }
        currentHistory = history.length - 1
        checkHistory()
    } else {
        return pathFolder
    }
}

const navigatorArrows = () => {
    $("[backward-arrow]").click(function() {
        if (history.length > 1 && +currentHistory > 0) {
            const getHistory = history[--currentHistory].path
            getNuvem(false, getHistory)
            checkHistory()
        }
    })

    $("[forward-arrow]").click(function() {
        if ((+currentHistory + 1) < history.length) {
            getNuvem(false, history[++currentHistory].path)
            checkHistory()
        }
    })
}

getNuvem(true)