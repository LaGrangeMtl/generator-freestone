const _ = require('lodash');
const Generator = require('yeoman-generator');

var getLowerCaseLetters = function () {
	return 'abcdefghijklmnopqrstuvwxyz';
};

var getSalt = function (len, set) {
	len = len || 20;
	set = set || '0123456789ABCDEFGHIJKLMNOPQURSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var	setLen = set.length,
		salt = '';
	for (var i = 0; i < len; i++) {
		var p = Math.floor(Math.random() * setLen);
		salt += set[p];
	}
	return salt;
}

const FREESTONE = 'Freestone';
const WORDPRESS = 'WordPress';
const STATIC = 'Statique';

const dbCredentials = {
	dbPassLocal: getSalt(16),
	dbPassDev: getSalt(16),
	dbPassStaging: getSalt(16),
	tablePrefix: getSalt(6, getLowerCaseLetters()),
}
module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.option('defaults');
	}

	async prompting() {
		this.defaults = [
			{
				type: "input",
				name: "projectName",
				message: "Nom du projet",
				default: this.appname,
			},
			{
				type: "input",
				name: "projectURL",
				message: "URL du projet",
				default: ({projectName}) => _.kebabCase(projectName) + '.master.local.enclos.ca',
			},
			{
				type: "list",
				name: "tech",
				message: "Quelle techno?",
				choices: [FREESTONE, WORDPRESS, STATIC],
				default: FREESTONE,
			}
		];
		
		if (this.options.defaults) {
			this.props = this.defaults.reduce((c, prompt) => {
				c[prompt.name] = prompt.default;
				return c;
			}, {});
		} else {
			this.props = await this.prompt(this.defaults);
		}
	}

	writing() {
		this.commonProps = {
			projectName: _.kebabCase(this.props.projectName),
			projectNamespace: _.camelCase(this.props.projectName),
		};
		
		this.freestoneProps = {
			projectPhpNamespace: _.startCase(_.camelCase(this.props.projectName)).replace(' ', ''),
			salt: getSalt(),
			secret: getSalt(65),
			...dbCredentials,
		};

		this.wordpressProps = {
			// authKey: getSalt(64),
			// secureAuthKey: getSalt(64),
			// loggedInKey: getSalt(64),
			// nonceKey: getSalt(64),
			// authSalt: getSalt(64),
			// secureAuthSalt: getSalt(64),
			// loggedInSalt: getSalt(64),
			// nonceSalt: getSalt(64),
			...dbCredentials,
		};

		this.fs.copyTpl(
			this.templatePath('common/**/*'),
			this.destinationPath(''),
			{
				props: {
					...this.commonProps,
				}
			},
			{},
			{ globOptions: { dot: true } },
		);

		if (this.props.tech === FREESTONE) {
			this.fs.copyTpl(
				this.templatePath('freestone/**/*'),
				this.destinationPath(''),
				{
					props: {
						...this.commonProps,
						...this.freestoneProps,
					}
				},
				{},
				{ globOptions: { dot: true } },
			);
		}

		if (this.props.tech === WORDPRESS) {
			this.fs.copyTpl(
				this.templatePath('wordpress/**/*'),
				this.destinationPath(''),
				{
					props: {
						...this.commonProps,
						...this.wordpressProps,
					}
				},
				{},
				{
					globOptions: {
						dot: true,
						ignore: [
							'**/plugins'
						]
					},
				},
			);

			// this.fs.copy(
			// 	this.templatePath('wordpress/dist/wp-content/plugins'),
			// 	this.destinationPath('dist/wp-content/plugins'),
			// );
		}

		if (this.props.tech === STATIC) {
			this.fs.copyTpl(
				this.templatePath('static/**/*'),
				this.destinationPath(''),
				{
					props: {
						...this.commonProps,
					}
				},
				{},
				{ globOptions: { dot: true } },
			);
		}
	}
	
	install() {
		if (this.props.tech === WORDPRESS) {
			const dbname = _.kebabCase(this.props.projectName) + '_master_local';

			this.spawnCommandSync('ssh', ['local.enclos.ca', 'bash', `~/create-database.sh "${dbname}" "${dbname}" "${this.wordpressProps.dbPassLocal}"`]);

			this.spawnCommandSync('wp', [
				'core',
				'download',
				'--path=dist/',
				'--skip-content',
			]);
			
			this.spawnCommandSync('wp', [
				'config',
				'create',
				`--dbname=${dbname}`,
				`--dbuser=${dbname}`,
				`--dbpass=${this.wordpressProps.dbPassLocal}`,
				`--dbhost=local.enclos.ca`,
				`--dbprefix=${dbCredentials.tablePrefix}`,
				`--path=./dist`
			]);

			this.spawnCommandSync('wp', [
				'core',
				'install',
				`--url=${this.props.projectURL}`,
				`--title=${this.props.projectName}`,
				'--admin_user=admin',
				'--prompt=admin_email,admin_password',
				`--path=./dist`
			]);
			
			this.spawnCommand('npm', ['run', 'vhost']);
		}
		
		// this.installDependencies({
		// 	bower: false,
		// });
	}

	end() {
		if (this.props.tech === WORDPRESS) {
			this.spawnCommand('mv', ['dist/wp-content/themes/_THEME_', 'dist/wp-content/themes/' + this.commonProps.projectNamespace]);
		}
	}
}
