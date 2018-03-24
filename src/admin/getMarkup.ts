const header = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ghoti Administration</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet">
</head>
<body>`;

const footer = `</body>
</html>`;

export function getMarkupForAdminUI() {
    return `${header}
    <div id="app"></div>
    <script src="/admin/generated/ghotiMeta.bundle.js"></script>
    <script src="/admin/js/main.bundle.js"></script>
    ${footer}`
}

export function getMarkupForInitPage() {
    return `
        ${header}
        Hello World
        ${footer}
    `
}