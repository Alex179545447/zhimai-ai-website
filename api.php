<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 处理OPTIONS预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/registrations.json';

// 获取数据
function getData() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        return [];
    }
    $content = file_get_contents($dataFile);
    return json_decode($content, true) ?: [];
}

// 保存数据
function saveData($data) {
    global $dataFile;
    return file_put_contents($dataFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // 获取所有注册数据
    $data = getData();
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    
} elseif ($method === 'POST') {
    // 添加新注册
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        exit;
    }
    
    // 添加唯一ID和时间戳
    $input['id'] = time() . '_' . uniqid();
    $input['created_at'] = date('Y-m-d H:i:s');
    
    $data = getData();
    $data[] = $input;
    
    if (saveData($data)) {
        echo json_encode(['success' => true, 'data' => $input]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save data']);
    }
    
} elseif ($method === 'DELETE') {
    // 删除指定记录
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing id parameter']);
        exit;
    }
    
    $data = getData();
    $data = array_filter($data, function($item) use ($input) {
        return $item['id'] != $input['id'];
    });
    $data = array_values($data); // 重新索引
    
    if (saveData($data)) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete data']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>