export default function getMarkupForAdminUI() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ghoti Administration</title>
</head>
<body>
    <div id="app"></div>
    <script src="/admin/generated/ghotiMeta.bundle.js"></script>
    <script src="/admin/js/main.js"></script>
</body>
</html>`
}