<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Fixture</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
    <link href="/style.min.css" rel="stylesheet" type="text/css">

</head>
<body>
<navbar></navbar>
<main role="main" class="container">

    <div id="page" class="starter-template">
        <fixture></fixture>
    </div>

</main><!-- /.container -->

<script type="text/javascript" src="/app.min.js"></script>
<script>
    route.start(true);
    riot.mount('*');
    app.init();
    console.log(app.events);
    app.events.on('login', function () {

        $("body").prepend($("<navbar/>"));
        riot.mount($("navbar")[0]);
    });

</script>
</body>
</html>
