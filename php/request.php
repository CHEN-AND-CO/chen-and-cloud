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
        if(!dbCheckUser($db, $login, $pass)){
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

    /* Connexion à la BDD */
    $db = dbConnect();
    if (!$db)
    {
        header ('HTTP/1.1 503 Service Unavailable');
        exit;
    }

    /* Vérifie la requete */
    $requestType = $_SERVER['REQUEST_METHOD'];
    $request = substr($_SERVER['PATH_INFO'], 1);
    $request = explode('/', $request);
    $requestRessource = array_shift($request);

    /* Gestion des requetes */
    if ($requestRessource == 'photos'){ // Gestion des photos
        if($requestType == 'GET'){ //Demande une ou des photos
            if(!isset($_GET['id'])){ // Si pas de photo précisée
                $output = dbRequestPhotos($db); // On demande à la BDD tous les liens
                sendJsonData($output, 'HTTP/1.1 200 OK'); // On envoie le résultat
            }else{ // Sinon
                $output = dbRequestPhoto($db, intval($_GET['id'])); // On demande l'emplacement de la photo à la BDD
                sendJsonData($output, 'HTTP/1.1 200 OK'); // On envoie le résultat
            }
        }else if($requestType == 'POST'){ //Ajout d'une photo
            $output = dbAddPhoto($db, $_POST['title'], $_POST['small'], $_POST['large']);
            sendJsonData($output, 'HTTP/1.1 201 OK');
        }
    }
    else if($requestRessource == 'authenticate') // Si on veut s'authentifier
    {
        authenticate($db); //Authentification
    }
    else if($requestRessource == 'register' && $requestType == 'POST') // Si on veut s'enregistrer
    {
        if(dbAddUser($db, $_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'])) //On ajoute l'user
        {
            error_log('User created, no error'); // Erreur pas d'erreur :D
            authenticate($db); // On s'authentifie
            header('HTTP/1.1 201 OK'); // Tout va bien
        }else{ // Sinon
            error_log('Registery refused (DB)'); // Aie
            header('HTTP/1.1 400 Bad Request'); // Du coup pas bien
        }
    }
    else if ($requestRessource == 'checkToken') // Vérification du token
    {
        if (verifyToken($db)) header('HTTP/1.1 200 OK'); //On fait ça
    }
    else if($requestRessource == 'comments') // Gestion des commentaires
    {
        if($requestType == 'GET') // Si on demande les commentaires d'une photo
        {
            $output = dbRequestComments($db, intval($_GET['id'])); // Demande à la BDD
            sendJsonData($output, 'HTTP/1.1 200 OK'); // On envoie le résultat
        }
        else if($requestType == 'POST') // Si on veut créer un commentaire
        {
            $output = dbAddComment($db, verifyToken($db), intval($_POST['id']), $_POST['comment']); // On demande à la bdd
            sendJsonData($output, 'HTTP/1.1 201 OK'); // On envoie le résultat
        }
        else if($requestType == 'DELETE') // Si on veut créer un commentaire
        {
            $output = dbDeleteComment($db, verifyToken($db), intval($_GET['id'])); // On demande à la BDD
            sendJsonData($output, 'HTTP/1.1 201 OK'); // On envoie le résultat
        }
    }
    else
    {
        header('HTTP/1.1 400 Bad Request'); // Aie aie aie, on ne sait pas faire !!!

        exit; // Bye
    }

    $login = verifyToken($db); // Vérification du token (et stockage dans login)

    exit; //Bye
?>