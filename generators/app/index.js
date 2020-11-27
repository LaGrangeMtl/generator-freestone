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

const FREESTONE = 'Freestone';
const WORDPRESS = 'WordPress';
const STATIC = 'Statique';
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
			dbPassLocal: getSalt(16),
			dbPassDev: getSalt(16),
			dbPassStaging: getSalt(16),
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

			this.fs.copy(
				this.templatePath('wordpress/dist/wp-content/plugins'),
				this.destinationPath('dist/wp-content/plugins'),
			);
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
			this.spawnCommand('wp', ['core', 'download', '--path=dist/', '--skip-content']);
		}
		
		this.installDependencies();
	}

	end() {
		if (this.props.tech === WORDPRESS) {
			this.spawnCommand('mv', ['dist/wp-content/themes/_THEME_', 'dist/wp-content/themes/' + this.commonProps.projectNamespace]);
		}
	}
}
