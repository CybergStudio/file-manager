let history = [{
    "path": ''
}]
let currentHistory = 0

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
            getCloud(false, getHistory)
            checkHistory()
        }
    })

    $("[forward-arrow]").click(function() {
        if ((+currentHistory + 1) < history.length) {
            getCloud(false, history[++currentHistory].path)
            checkHistory()
        }
    })
}