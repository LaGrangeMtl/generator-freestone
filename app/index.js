'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var getSalt = function (len) {
	len = len || 20;
	var set = '0123456789ABCDEFGHIJKLMNOPQURSTUVWXYZ -!$%?&*()=_+|£¢@{}[];:',
		setLen = set.length,
		salt = '';
	for (var i = 0; i < len; i++) {
		var p = Math.floor(Math.random() * setLen);
		salt += set[p];
	}
	return salt;
}

var LagrangeGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.pkg = require('../package.json');


		this.on('end', function () {
			if (!this.options['skip-install']) {
				this.installDependencies({
					callback: function () {
						this.spawnCommand('ln', ['-s', '../src', 'node_modules/src']);
						this.spawnCommand('ln', ['-s', '../src/lagrange', 'node_modules/lagrange']);
						this.spawnCommand('ln', ['-s', '../src/app', 'node_modules/'+this.props.projectNamespace]);
						console.log('Symbolic links for browserify created');
						this.spawnCommand('gulp', ['libcopy']);
					}.bind(this)
				});
			}
		});
	},

	askFor: function () {
		var done = this.async();

		// have Yeoman greet the user
		// this.log(this.yeoman);
this.log(chalk.magenta(
'                                          _o=<&&&&>=vo__\n                                        ?/$="\'"  """^=<&&R$~\\\n                                      .&?/\'              `""$$,\n                                    ,/?/\'       /-"^\\.   .-=~\\T,\n                                  ,/?/\'        /\\|6?`|  |<<q- ,??\n                                ./?/\'          `\\??dp\'  `$??,/|,i\\.\n                               ,*??              `"       ""\' `b\'\\\\$$&&\\.\n                              ,Td\'                             `&:`H\' "&7, .__\n                  ._.         H||            .                  `*\\H,  `&$$S:7|\n                 |????        M|,         ,--&|\\                  `&?b   ""://\'\n        .,o--vo\\,PJ\'H|,       H|L         ``\'"H?b                 ,-`?\\   ,&&\'\n       ,P?-""^==:=\' ||b       `L9,            `H`&,               |?:!|| ,P&\n       `b?\\          9/?       ??H,            |L *b.,\'"\\          :$:&  H]\'\n        `b$\\o.        */\\.      ??*b.           9.  `\\\\:(|     .,/$6d\'  |\\T\n          ``\\Z\\\\       `\\7b.    ,To?&b.          \\(\\:-.-S:-~=-"\'\',P     MJ\'\n             `\\?*b       ?&&\\.  d\\|<_ `\\o_       `&&M\\:?-+#:>\\.|,&\'    |LT\n               `\\?\\\\      ``\\?\\d|/`4RM|:~:$=v\\.    `$k<MR&MF$$?&J\'     HJ\'\n                 `\\?\\.       `\\b/$$$&v!-?&<?::P\\\\    `"^-^-?b=Sd\'     |\\T\n     _o~=~$&$>==v\\.??\\,         `\\d `\\$$\'9P\':-?>:"=\\ooo/=/$$~?$\\     ,R/\n   ./$?~^\'"""""`"\\\\&&< ?b               "`~$P:c: /v==v,#::?<<&:\'T|   d$/\'\n   :.             ""=o/&.                ,P    o&Z\'`\'.##| |MH\\|| ,$$\'\n   =:$H&=\\.           `"b?b.             .&\'    96*.-v.:?/`\\==$&?$&*\'\n       `^$?\\.           `*&*\\\\          ,P       ?~-~\'      |$$S>\'\n          `\\7b           ,T/\\&&\\.      d?                    |T\'\n            \\/b         .&J\'  `\\>     d\'                      T,\n             &`L        /||          ?|                        ?,\n             ||9       J\\T           H                          ?,\n              H||     ||/           ||                           9,\n              ||M     PJ\'           ||                           `H\n               bT,   ||T            ||                            ||\n               T/L   H||            `b                             M\n                &T,  M|              9,                            9\n                `L9, M|              `&.                           |\n                 `?*,9||              `b                           d\n                  `\\?(|H.              `b                          ?b\n                   `*\\ `&.              `\\.                       J*|b\n                     `\\o/\\.              `&.                     ,P 9/L\n                        9:&.              `9\\                   ??  `H9.\n                         *?9\\               `b                .&\'    |/|\n                          `|`\\.              `L             ./\'      `|H\n                          d\\/qZbo.            M          .,=\'        ,|T\n                 ./~&$$?=??/\' `"=H$|          H       .o=\'\'          J\\|\n                ,*/\'\'  `\\?        `\'        ./?ov=="*b9,            ,$P\n               ,Td                         ,$$\'`\'    ?|M           ,$/\n               J||                       ,$?/         M||         ?$/\n               M||         |>\\.     ._,~9$\'\'          T||        d\'M.\n               9`|         `Hi:R&:&&6&="\'           ./$J|       `^"\\Z\\.\n               ||M          `=Z\\:""                 H|T"            `&H&>v_\n                bT,    ..   v,?|\\                   M||               .:Z|&\\.\n                ||H  _oZ??v~>`d9H|                  `?*\\              ?$ `#\'H\n                 9/L||1+ "HH  .$/                    `bZ&\\       ,o\\&|}6| &/\'\n                  \\?$.:?ooo/*""\'                       `\\$$b_   |\\9|/|?:./\'\n                   `"""\'  `\'                              `~?&qo:?:\',p#/\'\n                                                             "^~<:>/"\n'
));

		// replace it with a short and sweet description of your generator
		this.log(chalk.red('On a eu un nouveau projet sur c\'tes affaire-là d\'internet. Savez-vous ce qu\'on va faire avec c\'te 400 piasses-là?'));

		//console.log(this);

		var getDefaultFromPrevious = function(propName) {
			return function(answers){
				return answers[propName];
			}
		};

		var optionnalJsLibs = [
			{
				name: 'Greensock',
				value: 'isGreensock',
				checked: true
			},
			{
				name: 'Selectric',
				value: 'isSelectric',
				checked: true
			},
			{
				name: 'Slick',
				value: 'isSlick',
				checked: true
			}
		];

		var prompts = [
			{
				name: 'projectName',
				type: 'input',
				message: 'Nom du client/projet',
				default : this.appname,
			},
			{
				name: 'homepage',
				type: 'input',
				message: 'Url',
			},
			{
				name: 'jqueryVersion',
				type: 'list',
				message: 'Quelle version de jQuery?',
				choices: [{
					name: '1.x',
					value: '<2',
					checked: false
				},
				{
					name: '2.x',
					value: '^2.1',
					checked: true
				},
				{
					name: '3+',
					value: '^3.2.1',
					checked: true
				}],
				default : '^3.2.1'
			},
			{
				name: 'isFreestone',
				type: 'confirm',
				message: 'Utilise Freestone?',
				default : true
			},
			{
				when: getDefaultFromPrevious('isFreestone'),
				name: 'dbName',
				type: 'input',
				message: 'Nom de la db mysql',
				default : getDefaultFromPrevious('projectname'),
			},
			{
				type: 'checkbox',
				name: 'optionnalJsLibs',
				message: 'Quelles librairies javascript doivent être importées?',
				choices: optionnalJsLibs
			}

		];

		this.prompt(prompts, function (answers) {
			this.props = answers;
			function hasFeature(feat) { return features.indexOf(feat) !== -1; }

			this.props.projectNamespace = this._.camelize(this.props.projectName);
			this.props.salt = getSalt();
			this.props.secret = getSalt(65);
			this.props.jsLibs = optionnalJsLibs.reduce(function(cur, el) {
				var val = el.value;
				cur[val] = answers.optionnalJsLibs.indexOf(val) !== -1;
				return cur;
			}, {});

			done();
		}.bind(this));
	},

	writeIndex : function () {
		
	},

	app: function () {
		this.mkdir('img');
		this.mkdir('js');
		this.mkdir('css');

		this.directory('src', 'src');
		this.mkdir('assets');
		this.directory('scss', 'scss');

		['package.json', 'gulpfile.js', 'bower.json', '.gitignore', 'README.md', 'deploy.sh', '.editorconfig', '.htaccess', '.rsync.exclude', '.eslintrc'].forEach(fileName => {
			this.template(`_${fileName}`, fileName);
		});

		if(this.props.isFreestone) {
			this.mkdir('config');
			this.template('freestone/config/config.php', 'config/config.php');
			this.template('freestone/config/robots.txt', 'config/robots.txt');
			this.directory('freestone/modules', 'modules');
			this.directory('freestone/lang', 'lang');
			this.directory('freestone/views', 'views');
			this.directory('freestone/admin', 'views');
		} else {

		}

	},

	projectfiles: () => {

	}
});

module.exports = LagrangeGenerator;
