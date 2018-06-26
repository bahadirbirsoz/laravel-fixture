<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function fail($data = null, $code = null)
    {
        if (is_numeric($data) && $code == null) {
            $code = $data;
            $data = null;
        }
        $message = "Unknown Error Occured";
        switch ($code) {
            case 404:
                $message = "Record Not Found";
                break;
        }
        $result = [
            "status" => "fail",
            "error" => $message,
            "code" => $code,
        ];
        if ($data) {
            $result["data"] = $data;
        }
        return $result;
    }

    public function success($data, $code = 200)
    {
        return [
            "status" => "success",
            "code" => $code,
            "data" => $data
        ];
    }

}

