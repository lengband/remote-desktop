const openAboutWindow = require('about-window').default;
const path = require('path')

const create = () => openAboutWindow({
    icon_path: path.join(__dirname, 'icon.png'),
    package_json_dir: path.resolve(__dirname  + '/../../../'),
    copyright: 'Copyright (c) 2021 lengband',
    homepage: 'https://github.com/lengband/remote-app',
    bug_report_url: 'https://github.com/lengband/remote-app/issues',
})

module.exports = { create }

