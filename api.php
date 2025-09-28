<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");

$host = "localhost";
$dbname = "keuangan_harian";
$username = "keuangan_user";
$password = "password";

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
    exit;
}

if ($method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM transactions ORDER BY transaction_date DESC");
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($transactions);
    
} elseif ($method == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("INSERT INTO transactions (type, amount, description, transaction_date) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $input['type'],
        $input['amount'],
        $input['description'],
        $input['date']
    ]);
    
    echo json_encode(["message" => "Transaction added"]);
    
} elseif ($method == 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("DELETE FROM transactions WHERE id = ?");
    $stmt->execute([$input['id']]);
    
    echo json_encode(["message" => "Transaction deleted"]);
}
?>