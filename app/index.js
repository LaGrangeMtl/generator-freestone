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
					}.bind(this)
				});
			}
		});
	},

	askFor: function () {
		var done = this.async();

		// replace it with a short and sweet description of your generator
		this.log(chalk.red('On a eu un nouveau projet sur c\'tes affaire-là d\'internet. Savez-vous ce qu\'on va faire avec c\'te 400 piasses-là?'));

		//console.log(this);

		var getDefaultFromPrevious = function(propName) {
			return function(answers){
				return answers[propName];
			}
		};

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
				name: 'isFreestone',
				type: 'confirm',
				message: 'Utilise Freestone?',
				default : true
			},
			{
				name: 'dbName',
				type: 'input',
				message: 'Nom de la db mysql',
				default : getDefaultFromPrevious('projectname'),
			}

		];

		this.prompt(prompts, function (answers) {
			this.props = answers;
			function hasFeature(feat) { return features.indexOf(feat) !== -1; }

			this.props.projectNamespace = this._.camelize(this.props.projectName);
			this.props.salt = getSalt();
			this.props.secret = getSalt(65);

			done();
		}.bind(this));
	},

	writeIndex : function () {
		
	},

	app: function () {
		['package.json', 'gulpfile.js', 'bower.json', '.gitignore', 'README.md', 'deploy.sh', '.editorconfig', '.htaccess', '.rsync.exclude', '.eslintrc'].forEach(fileName => {
			this.template(`_${fileName}`, fileName);
		});
	},

	projectfiles: () => {

	}
});

module.exports = LagrangeGenerator;
