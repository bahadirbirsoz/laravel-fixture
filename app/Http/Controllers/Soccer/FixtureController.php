<?php

namespace App\Http\Controllers;

use App\Match;
use App\Season;
use App\Team;

class FixtureController extends Controller
{

    protected $busyWeeks;
    protected $arragedMatches;

    public function index()
    {
        $matches = Match::where('status', 'done')->get();
        $teams = Team::all();
        $data = [];
        foreach ($teams as $team) {
            $data[$team->id] = $team->toArray() + [
                    'point' => 0,
                    'games_played' => 0,
                    'wins' => 0,
                    'draw' => 0,
                    'lost' => 0,
                    'goals_forward' => 0,
                    'goals_against' => 0,
                    'goal_difference' => 0
                ];
        }

        foreach ($matches as $match) {
            $data[$match->home_team_id]['games_played']++;
            $data[$match->away_team_id]['games_played']++;

            $data[$match->home_team_id]['goals_forward'] += $match->home_score;
            $data[$match->home_team_id]['goals_against'] += $match->away_score;

            $data[$match->away_team_id]['goals_forward'] += $match->away_score;
            $data[$match->away_team_id]['goals_against'] += $match->home_score;

            if ($match->score_home > $match->score_away) { // home wins
                $data[$match->home_team_id]['point'] += 3;

                $data[$match->home_team_id]['wins']++;
                $data[$match->away_team_id]['lost']++;


            } elseif ($match->score_home < $match->score_away) { // away wins
                $data[$match->away_team_id]['point'] += 3;

                $data[$match->home_team_id]['lost']++;
                $data[$match->away_team_id]['wins']++;

            } else { // tie
                $data[$match->away_team_id]['point'] += 1;
                $data[$match->home_team_id]['point'] += 1;

                $data[$match->home_team_id]['draw']++;
                $data[$match->away_team_id]['draw']++;
            }
        }
        usort($data, function ($a, $b) {
            if ($a['point'] != $b['point']) {
                return $a['point'] < $b['point'] ? 1 : -1;
            }
            if ($a['goal_difference'] == $b['goal_difference']) {
                return 0;
            }
            return $a['goal_difference'] < $b['goal_difference'] ? 1 : -1;
        });

        return $this->success($data);
    }

    public function reset()
    {
        Match::truncate();
        Season::truncate();
        $teams = Team::all();
        $this->busyWeeks = [];
        $this->arragedMatches = [];

        $numberOfWeeks = 2 * (count($teams) - 1);

        for ($i = 1; $i <= $numberOfWeeks; $i++) {
            $this->busyWeeks[$i] = [];
        }

        foreach ($teams as $homeKey => $homeTeam) {
            foreach ($teams as $awayKey => $awayTeam) {
                $isSameTeam = $awayTeam->id == $homeTeam->id;
                $alreadyArranged = in_array([$homeTeam->id, $awayTeam->id], $this->arragedMatches);
                if ($isSameTeam || $alreadyArranged) {
                    continue;
                }
                $week = $this->findWeek($homeTeam->id, $awayTeam->id);
                $this->saveMatch($homeTeam->id, $awayTeam->id, $week);
                $this->saveMatch($awayTeam->id, $homeTeam->id, $week + ($numberOfWeeks / 2));
            }
        }

        $season = new Season();
        $season->week = 0;
        $season->total_weeks = $numberOfWeeks;
        $season->save();
        return $this->success($season);
    }

    protected function findWeek($homeTeamId, $awayTeamId)
    {
        foreach ($this->busyWeeks as $weekNumber => $busyTeams) {
            if (in_array($homeTeamId, $busyTeams) || in_array($awayTeamId, $busyTeams)) {
                continue;
            }
            return $weekNumber;
        }
    }

    protected function saveMatch($homeTeamId, $awayTeamId, $week)
    {
        $this->busyWeeks[$week][] = $homeTeamId;
        $this->busyWeeks[$week][] = $awayTeamId;

        $match = new Match();
        $match->home_team_id = $homeTeamId;
        $match->away_team_id = $awayTeamId;
        $match->week = $week;
        $match->status = "pending";
        $match->save();

        $this->arragedMatches[] = [$homeTeamId, $awayTeamId];
    }


    public function stats()
    {
        
    }


}
