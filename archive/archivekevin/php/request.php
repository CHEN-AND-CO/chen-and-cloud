<?php
    require_once('database.php');

    function sendJsonData($message, $h){
        header($h);

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

    $db = dbConnect();
    if (!$db)
    {
      header ('HTTP/1.1 503 Service Unavailable');
      exit;
    }
  
    $requestType = $_SERVER['REQUEST_METHOD'];
    $request = substr($_SERVER['PATH_INFO'], 1);
    $request = explode('/', $request);
    $requestRessource = array_shift($request);
    
    if($requestRessource == 'authenticate'){
        authenticate($db);
    }

    $login = verifyToken($db);

    exit;
?>