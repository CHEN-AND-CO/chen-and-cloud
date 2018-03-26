<?php
    require_once('database.php');

    function sendJsonData($message, $h){
        header($h);
        header('Content-Type: text/plain; charset=utf-8');
        header('Cache-control: no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');

        echo json_encode($message);
    }

    function authenticate($db){
        $login = $_SERVER['PHP_AUTH_USER'];
        $pass = $_SERVER['PHP_AUTH_PW'];

        if(!dbCheckUserInjection($db, $login, $pass)){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }

        $token = base64_encode(openssl_random_pseudo_bytes(12));
        dbAddToken($db, $login, $token);
        header('Content-Type: text/plain; charset=utf-8');
        header('Cache-control: no-store, no-cache, must-revalidate');
        header('Pragma: no-cache');
        echo $token;
        
        exit;
    }

    function verifyToken($db){
        $headers = getallheaders();
        $token = $headers['Authorization'];
        if (preg_match('/Bearer (.*)/', $token, $tab))$token = $tab[1];
        if(!($login = dbVerifyToken($db, $token))){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }

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

    $id = array_shift($request);
    if ($id == '') $id = NULL;


    if ($requestRessource == 'photos')
    {
        if($id == NULL)
        {
            $output = dbRequestPhotos($db);
        }
        else
        {
            $output = dbRequestPhoto($db, intval($id));
        }

        if($output != false){
            sendJsonData($output, 'HTTP/1.1 200 OK');
        }

    }
    else if($requestRessource == 'authenticate')
    {
        authenticate($db);
    }
    else if ($requestRessource == 'checkToken')
    {
        if (verifyToken($db)) header('HTTP/1.1 200 OK');
    }
    else if($requestRessource == 'comments')
    {
        if($requestType == 'GET')
        {
            $output = dbRequestComments($db, intval($id));
            error_log($output);
            sendJsonData($output, 'HTTP/1.1 200 OK');
            exit;
        }
        else if($requestType == 'POST')
        {
            $output = dbAddComment($db, intval($id), intval($id), $_POST('comment'));
        }
        else if($requestType == 'DELETE')
        {
            $output = dbDeleteComment($db, intval($id), intval($id));
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