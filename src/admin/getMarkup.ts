export default function getMarkupForAdminUI() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ghoti Administration</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet">
</head>
<body>
    <div id="app"></div>
    <script src="/admin/generated/ghotiMeta.bundle.js"></script>
    <script src="/admin/js/main.js"></script>
</body>
</html>`
}