<?php

namespace App\Http\Controllers;

use App\Match;

class ResetController extends Controller
{

    public function index()
    {
        Match::truncate();
    }


}