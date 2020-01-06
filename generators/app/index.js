const _ = require('lodash');
const Generator = require('yeoman-generator');

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
				type: "confirm",
				name: "isFreestone",
				message: "Utilise freestone ?",
				default: true,
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
		let tplFiles = [
			'package.json',
			'scripts/deploy.sh',
			'src/js/NameSpace.js',
		];

		let excluded = [
			'.DS_Store',
			'package-lock.json',
		];

		if (!this.props.isFreestone) {
			tplFiles = [
				...tplFiles,
				'dist/index.html',
			];
			excluded = [
				this.templatePath('db'),
				this.templatePath('dist/admin'),
				this.templatePath('dist/config'),
				this.templatePath('dist/modules'),
				this.templatePath('dist/uploads'),
				this.templatePath('dist/views'),
				this.templatePath('dist/.htaccess'),
				this.templatePath('dist/api.php'),
				this.templatePath('dist/bootstrap.php'),
				this.templatePath('dist/composer.json'),
				this.templatePath('dist/Hooks.php'),
				this.templatePath('dist/imageBank.php'),
				this.templatePath('dist/index.php'),
				this.templatePath('config'),
			];
		} else {
			tplFiles = [
				...tplFiles,
				'config/',
				'dist/admin/hooks/AbstractHook.php',
				'dist/config/config.php',
				'dist/views/partials/head.twig',
			]
			excluded = [
				this.templatePath('dist/index.html'),
			];
		}

		this.fs.copy(
			this.templatePath('**/*'),
			this.destinationPath(''),
			{
				globOptions: {
					dot: true,
					ignore: [
						...tplFiles,
						...excluded
					]
				},
			},
		);

		tplFiles.forEach(path => {
			this.fs.copyTpl(
				this.templatePath(path),
				this.destinationPath(path),
				{
					props: {
						projectName: _.kebabCase(this.props.projectName),
						projectNamespace: _.camelCase(this.props.projectName),
						projectPhpNamespace: _.startCase(_.camelCase(this.props.projectName)).replace(' ', ''),
						salt: getSalt(),
						secret: getSalt(65),
						dbPassDev: getSalt(16),
						dbPassStaging: getSalt(16),
					}
				}
			);
		});

		this.installDependencies();
	}
}
