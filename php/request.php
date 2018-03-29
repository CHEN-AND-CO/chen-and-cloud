<?php
    /* Inclusion des constantes du projet */
    require_once('database.php');

    /* Envoi des données sous format JSON avec un header personnalisé */
    function sendJsonData($message, $h){
        header($h);
        header('Content-Type: text/plain; charset=utf-8');
        header('Cache-control: no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');

        echo json_encode($message);
    }

    /* Authentification */
    function authenticate($db){
        $login = $_SERVER['PHP_AUTH_USER'];
        $pass = $_SERVER['PHP_AUTH_PW'];

        /* Vérifie l'utilisateur */
        if(!dbCheckUserInjection($db, $login, $pass)){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }

        /* Génération du token */
        $token = base64_encode(openssl_random_pseudo_bytes(12));

        /* Ajout du token */
        dbAddToken($db, $login, $token);

        header('Content-Type: text/plain; charset=utf-8');
        header('Cache-control: no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');
        echo $token;
        
        exit;
    }

    /* Vérification du token */
    function verifyToken($db){
        /* Récupère les headers HTTP */
        $headers = getallheaders();

        /* Récupère le token */
        $token = $headers['Authorization'];
        
        /* Vérifie le token et récupère le login */
        if (preg_match('/Bearer (.*)/', $token, $tab))$token = $tab[1];
        if(!($login = dbVerifyToken($db, $token))){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }

        /* Renvoie le login */
        return $login;
    }

    // Database connexion.
    $db = dbConnect();
    if (!$db)
    {
        header ('HTTP/1.1 503 Service Unavailable');
        exit;
    }

    // Check the request.
    $requestType = $_SERVER['REQUEST_METHOD'];
    $request = substr($_SERVER['PATH_INFO'], 1);
    $request = explode('/', $request);
    $requestRessource = array_shift($request);

    if ($requestRessource == 'photos'){
        if(!isset($_GET['id'])){
            $output = dbRequestPhotos($db);
            sendJsonData($output, 'HTTP/1.1 200 OK');
        }else{
            $output = dbRequestPhoto($db, intval($_GET['id']));
            sendJsonData($output, 'HTTP/1.1 200 OK');
        }
    }
    else if($requestRessource == 'authenticate')
    {
        authenticate($db);
    }
    else if($requestRessource == 'register' && $requestType == 'POST')
    {
        if(dbAddUser($db, $_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW']))
        {
            error_log('User created, no error');
            authenticate($db);
            header('HTTP/1.1 201 OK');
        }else{
            error_log('Registery refused (DB)');
            header('HTTP/1.1 400 Bad Request');
        }
    }
    else if ($requestRessource == 'checkToken')
    {
        if (verifyToken($db)) header('HTTP/1.1 200 OK');
    }
    else if($requestRessource == 'comments')
    {
        if($requestType == 'GET')
        {
            $output = dbRequestComments($db, intval($_GET['id']));
            sendJsonData($output, 'HTTP/1.1 200 OK');
        }
        else if($requestType == 'POST')
        {
            $output = dbAddComment($db, verifyToken($db), intval($_POST['id']), $_POST['comment']);
            sendJsonData($output, 'HTTP/1.1 201 OK');
        }
        else if($requestType == 'DELETE')
        {
            $output = dbDeleteComment($db, verifyToken($db), intval($_GET['id']));
            sendJsonData($output, 'HTTP/1.1 201 OK');
        }
    }
    else
    {
        header('HTTP/1.1 400 Bad Request');

        exit;
    }

    $login = verifyToken($db);

    exit;
?>