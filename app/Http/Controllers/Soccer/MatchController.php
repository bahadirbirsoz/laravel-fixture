<?php

namespace App\Http\Controllers;

use App\Match;
use App\Season;
use App\Team;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index()
    {
        return $this->success(Match::all()->toArray());
    }

    public function update(Request $request, $matchId)
    {
        $match = Match::find($matchId);
        if (!$match) {
            return $this->fail(404);
        }
        $match->score_home = $request->input("score_home");
        $match->score_away = $request->input("score_away");
        $match->save();
        return $this->success($match->toArray());
    }

    public function play($matchId)
    {
        $match = Match::find($matchId);
        $this->playMatch($match);
        return $this->success($match->toArray());
    }

    public function playAll()
    {
        $matches = Match::where("status", "pending")->get();
        foreach ($matches as $match) {
            $this->playMatch($match);
        }
        return $this->success($matches);
    }

    public function week($seasonId)
    {
        $season = Season::find($seasonId);
        $matches = Match::where('week', $season->week)->get();
        foreach ($matches as &$match) {
            $match->home = Team::find($match->home_team_id);
            $match->away = Team::find($match->away_team_id);
        }
        return $this->success([
            'matches' => $matches,
            'season' => $season
        ]);
    }

    public function playWeek($seasonId)
    {
        $season = Season::find($seasonId);
        if ($season->week == $season->total_weeks) {
            return $this->fail(400);
        }
        $season->week++;
        $season->save();
        $matches = Match::where('week', $season->week)->get();
        foreach ($matches as $match) {
            $this->playMatch($match);
        }
        $matches = Match::where('week', $season->week)->get();
        foreach ($matches as &$match) {
            $match->home = Team::find($match->home_team_id);
            $match->away = Team::find($match->away_team_id);
        }
        return $this->success([
            'matches' => $matches,
            'season' => $season
        ]);
    }

    protected function playMatch(Match $match)
    {
        $season = Season::find();
        $match->score_home = 0;
        $match->score_away = 0;
        $homeTeam = Team::find($match->home_team_id);
        $awayTeam = Team::find($match->away_team_id);
        $homeChance = rand(80, 100);
        $awayChance = rand(60, 80);
        $homeScoreMultiplier = $homeTeam->strength * $homeChance;
        $awayScoreMultiplier = $awayTeam->strength * $awayChance;
        $chanceRate = ($homeScoreMultiplier / $awayScoreMultiplier) + ((rand(0, 100) - 50) / 60);

        $totalGoals = floor(sqrt(floor($chanceRate * 10000) % 70)) - 2;
        for ($i = 0; $i < $totalGoals; $i++) {
            $dummyRate = rand(80, 120) / 100;
            if ($chanceRate > $dummyRate) {
                $match->score_home++;
                $homeScoreMultiplier = sqrt($homeScoreMultiplier);
            } else {
                $match->score_away++;
                $awayScoreMultiplier = sqrt($awayScoreMultiplier);
            }
            $chanceRate = ($homeScoreMultiplier / $awayScoreMultiplier) + ((rand(0, 100) - 50) / 60);
        }
        $match->status = "done";
        $match->save();
    }

}