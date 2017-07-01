export default function getMarkupForAdminUI() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ghoti Administration</title>
</head>
<body>
    <div id="app"></div>
    <srcipt src="/ghoti/generated/ghoti.meta.bundle.js"></script>
    <script src="/ghoti/js/main.js"></script>
</body>
</html>`
}