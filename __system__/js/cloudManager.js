$(document).ready(function() {
    var modal = document.getElementById('my-progress-modal');
    var modal2 = document.getElementById('my-view-image-modal');
    var span = document.getElementsByClassName("close-progress-modal")[0];
    var span2 = document.getElementsByClassName("close-progress-modal")[1];
    
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

const getCloud = (delay = true, folderByHistory = '') => {
    const timeout = delay ? 2000 : 10;
    const cloud = document.querySelector("[cloud-container]")
    const pathFunc = $("[path-func]").val()

    setTimeout(() => {
        $.ajax({
            dataType: 'json',
            type: 'post',
            data: `getCloud=${pathFunc + folderByHistory}`,
            url: `${BASE_URL}api/cloudManager`,
            beforeSend: function() {
                cloud.innerHTML = `
                    <h3 class="help-block-cloud">${loadingRes('')}</h3>
                `
            },
            success: function(json) {
                if (+json['status'] === 3) {

                    const folder = folderByHistory !== '' ? folderByHistory : pathFunc
                    Toast.fire({
                        type: 'error',
                        title: `The ${folder} folder wasn't found!`
                    })
                    getCloud(false)

                } else if (json['status']) {

                    writeBase(pathFunc + folderByHistory)

                    writeCurrentFolder(pathFunc + folderByHistory)
                    writeDirectoryUl(json['cloud']['folder'], json['cloud']['file'])

                } else {
                    
                    cloud.innerHTML = `
                        <h3 class="help-block-cloud">${json['error']}</h3>
                    `

                }
            },
            error: function(json) {
                cloud.innerHTML = `
                    <h3 class="help-block-cloud">An unexpected error occurred!</h3>
                `
            }
        })
    }, timeout)
}

const writeBase = (pathFunc) => {
    const cloud = document.querySelector("[cloud-container]")
    const cloudsName = document.querySelector("[path-func]").value.split('/')

    cloud.innerHTML = `
            <div class="cloud-left-div">
                <span title="Add folder" class="cloud-left-button" func-cloud="add">
                    <i class="fas fa-folder-plus"></i>
                </span>
                <span title="Clear folder" class="cloud-left-button" func-cloud="clear">
                    <i class="fas fa-folder-minus"></i>
                </span>

                <span title="Upload files" class="cloud-left-button" func-cloud="up">
                    <label style="cursor:pointer;" for="upload-files">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </label>
                </span>

                <form style="position:absolute;" form-upload enctype="multipart/form-data">
                    <input name="upload[]" id="upload-files" upload-files type="file" multiple />
                </form>

                <span title="Reload the cloud" class="cloud-left-button" func-cloud="reload">
                    <i class="fas fa-redo"></i>
                </span>

                <span title="Clear the history" class="cloud-left-button" func-cloud="clearHistory">
                    <i class="fas fa-trash-alt"></i>
                </span>
                
                <input style="position:absolute;" type="hidden" input-directory-path />
            </div>
            <div class="cloud-right-div">
                <div class="top-task-div">
                    <div class="arrow-path-travel-div">
                        <span title="Backward" backward-arrow><i class="fas fa-arrow-left"></i></span>
                        <span title="Forward" forward-arrow><i class="fas fa-arrow-right"></i></span>
                    </div>
                    
                    <h1 class="cloud-title"><i class="fas fa-cloud"></i> ${cloudsName[1] || 'Cloud'}</h1>
                </div>
                <div class="folder-path-div" directory-path class="directory-path">
                    Folder path:<span></span>
                </div>

                <ul class="folder-content-list" write-links></ul>
                <ul class="write-directory-div" write-directory></ul>
            </div>
    `

    
    document.querySelector("[write-links]").onselectstart = new Function('return false') 
    
    checkHistory()
    writeDirectoryPath(pathFunc)
    cloudLeftDiv()
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
                    <li class="list-for-hover" span-show-content directory="${directory}/${e.name}">
                        <i class="${e.icon}"></i> &nbsp;&nbsp;&nbsp;${e.name} &nbsp;&nbsp;&nbsp;
                        <i class="${e.empty ? `gray-circle` : `red-circle` }" title="${e.empty ? `This folder is empty` : `This folder have content` }"></i>
                        
                        <btn class="folder-action-button" span-rename-folder title="Rename this folder">
                            <i class="fas fa-edit"></i>
                        </btn> 
                        <btn class="folder-action-button" span-delete-folder title="Delete this folder">
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
                            <span span-show-image title="See this image">
                                <i style="font-size:8pt;" class="fas fa-eye"></i>
                            </span>
                        ` : ``}
    
                        <span span-download-file title="Download this file">
                            <i class="fas fa-download"></i>
                        </span>
                        <span span-rename-file title="Rename this file">
                            <i class="fas fa-edit"></i>
                        </span>
                        <span span-delete-file title="Delete this file">
                            <i class="fas fa-trash-alt"></i>
                        </span>
                    </li>
                `
            )
        })

        directoryFunctions()
    } else {
        writeUl.innerHTML = `<li>This folder is empty for now.</li>`
    }
}

const writeCurrentFolder = (currentFolder) => {
    const currentFolderArray = currentFolder.split('/')
    const currentFolderName = currentFolderArray[currentFolderArray.length - 1]

    document.querySelector('[write-links]').innerHTML = `
        <li title="Current folder" class="directory-current-folder" reload-folder 
            directory="${currentFolder}" display="show">
                <div class="span-folders">
                    <i class="fas fa-folder-open"></i>
                </div>
                <div class="span-folder-name"> &nbsp;${currentFolderName}</div>
        </li>
    `
    
    $("[input-directory-path]").val(currentFolder)

    reloadCurrentFolder()
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
        url: `${BASE_URL}api/cloudManager`,
        success: function(json) {
            if (json['status']) {
                writeDirectoryPath(directory)
                writeDirectoryUl(json['cloud']['folder'], json['cloud']['file'])
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
                title: `The ${nameFolder} folder has probably been deleted or renamed`
            })

            writeUl.html(`<li><b style="margin-right:10px;">Tip:</b> Reload the cloud</li>`)
        }
    })
}

getCloud(true)