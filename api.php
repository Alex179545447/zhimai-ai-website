<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . '/registrations.json';

// 获取所有数据
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
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        echo json_encode(getData());
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            $input = $_POST;
        }
        
        $userType = isset($input['userType']) ? $input['userType'] : '';
        $identityType = isset($input['identityType']) ? $input['identityType'] : '';
        $name = isset($input['name']) ? trim($input['name']) : '';
        $wechat = isset($input['wechat']) ? trim($input['wechat']) : '';
        $phone = isset($input['phone']) ? trim($input['phone']) : '';
        
        if (empty($name) || empty($wechat) || empty($phone)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => '请填写完整信息']);
            break;
        }
        
        $data = getData();
        $id = count($data) > 0 ? max(array_column($data, 'id')) + 1 : 1;
        
        $newRecord = [
            'id' => $id,
            'userType' => $userType,
            'identityType' => $identityType,
            'name' => $name,
            'wechat' => $wechat,
            'phone' => $phone,
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        $data[] = $newRecord;
        saveData($data);
        
        echo json_encode(['success' => true, 'message' => '提交成功', 'data' => $newRecord]);
        break;
        
    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($input['id']) ? intval($input['id']) : 0;
        
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => '无效的ID']);
            break;
        }
        
        $data = getData();
        $data = array_filter($data, function($item) use ($id) {
            return $item['id'] != $id;
        });
        $data = array_values($data);
        saveData($data);
        
        echo json_encode(['success' => true, 'message' => '删除成功']);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => '不支持的请求方法']);
}
?>
