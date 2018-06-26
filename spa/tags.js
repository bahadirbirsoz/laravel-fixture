
riot.tag2('fixture', '<h2>Current Point Table</h2> <table class="table-bordered table table-hover table-striped"> <tr> <th>Team</th> <th>GP</th> <th>Pts</th> <th>W</th> <th>D</th> <th>L</th> <th>GF</th> <th>GA</th> <th>+/-</th> </tr> <tr each="{_data}"> <td>{team}</td> <td>{games_played}</td> <td>{point}</td> <td>{wins}</td> <td>{draw}</td> <td>{lost}</td> <td>{goals_forward}</td> <td>{goals_against}</td> <td>{goal_difference}</td> </tr> </table> <div class="row"> <div class="col-md-12"><a class="pull-right btn btn-warning" onclick="{finish}">Play All</a></div> </div> <div class="row"> <div class="col-md-6"> <thisweek></thisweek> </div> </div>', '', '', function(opts) {
    _data = [];
    var self = this;

    this.finish = function(e){
        rest.post("/match/play-all").then(function () {
            self.load();
        });
    }.bind(this)

    this.load = function(){
        rest.get('/fixture').then(function (data) {
            _data = data;
            self.update();
        });
    }.bind(this)

    this.on('mount', function () {
        self.load();
    });
});

riot.tag2('navbar', '<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top"><a class="navbar-brand" href="#">Fixture</a> <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button> <div class="collapse navbar-collapse" id="navbarsExampleDefault"> <ul class="navbar-nav mr-auto"> <li class="nav-item active"><a class="nav-link" href="#">Fixture<span class="sr-only">(current)</span></a></li> </ul> </div> </nav>', '', '', function(opts) {
});

riot.tag2('prediction', '', '', '', function(opts) {
});

riot.tag2('thisweek', '<h3>{_data.season.week}. Week Matches</h3> <table class="table-striped table table-hover table-bordered"> <tbody> <tr class="d-flex" each="{_data.matches}"> <td class="col-md-5">{home.team}</td> <td class="col-md-1">{score_home}</td> <td class="col-md-1">{score_away}</td> <td class="col-md-5">{away.team}</td> </tr> </tbody> </table>', '', '', function(opts) {
    var self = this;
    _data = {
        matches: [],
        season: {}
    }
    this.on('mount', function () {
        rest.get('/week/1').then(function (data) {
            _data = data;

            self.update();
        });
    });
});