module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')
		dir: # ディレクトリ設定

			libmin: "lib_minified"

			src: "__src" # __srcフォルダ置き換え

			public: "_public" # distフォルダ置き換え


		#html,xml関係
		jade:
			compilehtml:
				options:
					pretty: true
				files: [
					expand: true
					cwd: '<%=dir.src%>/_jade'
					src: ['**/*.jade']
					dest: '<%=dir.src%>/html' 
					ext: '.html'
				]
			compilexml:
				options:
					pretty: true
				files: [
					expand: true
					cwd: '<%=dir.src%>/_jadexml'
					src: ['**/*.jade']
					dest: '<%=dir.src%>/xml' 
					ext: '.xml'
				]
		htmlmin:
			htmlminify:
				options:
					removeComments: true
					removeCommentsFromCDATA: true
					removeCDATASectionsFromCDATA: true
					collapseWhitespace: true
					removeOptionalTags: true
					minifyJS: true
					ignoreCustomComments: [ ]
				expand: true
				cwd: '<%=dir.src%>/html'
				src: '**/*.html'
				dest: '<%=dir.public%>'
			xmlminify:
				options:
					removeComments: true
					removeCommentsFromCDATA: true
					removeCDATASectionsFromCDATA: true
					collapseWhitespace: true
					removeOptionalTags: true
					minifyJS: true
					ignoreCustomComments: [ ]
				expand: true
				cwd: '<%=dir.src%>/xml'
				src: '**/*.html'
				dest: '<%=dir.public%>/xml'




		#css関係
		stylus:
			options:
				compress: false
			dist:
				expand: true
				cwd: '<%=dir.src%>/_stylus'
				src: '*.stylus'
				dest:'<%=dir.src%>/css/compile'
				ext: '.css'
		autoprefixer:
			options:
				browsers: [
					'last 3 versions', 'ie 8' ,'ie 9'
				]
			prefix:
				expand: true
				flatten: false
				cwd: '<%=dir.src%>/css/compile'
				src: '*.css'
				dest:'<%=dir.src%>/css/prefix'
				ext: '.css'
		cssmin:
			target:
				files:[
					expand: true
					cwd: '<%=dir.src%>/css/prefix'
					src: '*.css'
					dest:'<%=dir.public%>/css'
					ext: '.css'
				]


		#js関係
		coffee:
			compile:
				options:
					bare: true
				files: [
					expand: true
					cwd: '<%=dir.src%>/_coffee'
					src: ['**/*.coffee']
					dest: '<%=dir.src%>/js'
					ext: '.js'
				]
		concat:
			options:[
				separator: ';'
				stripBanners: true
				banner: '/*! <%=pkg.name%> - v<%=pkg.version%> - ' +'<%=grunt.template.today("yyyy-mm-dd")%> */'
			]
			dist:
				files:[
					'<%=dir.src%>/js/concat/raw.js':'<%=dir.src%>/js/*.js'
					'<%=dir.public%>/js/concat/raw.js':'<%=dir.src%>/js/*.js'
				]
		uglify:
			dist:
				files:[
					expand: true
					cwd: '<%=dir.src%>/js'
					src: ['**/*.js']
					dest: '<%=dir.public%>/js'
					ext: '.js'
				]

				
		#img関係
		imagemin:
			util:
				options:
					optimizationLevel:7
				files:[
					expand: true
					cwd:'<%=dir.src%>/images'
					src: ['access/*.png','util/*.{png,gif,jpg}']
					dest: '<%=dir.public%>/img'
				]
			thumbs:
				options:
					optimizationLevel: 7
				files: [
					expand: true
					cwd:'<%=dir.src%>/images'
					src: ['**/thumb_mono.png','**/thumb_poly.png']
					dest: '<%=dir.public%>/img'
				]
			detail:
				options:
					optimizationLevel: 6
				files: [
					expand: true
					cwd:'<%=dir.src%>/images'
					src: ['**/detail.png']
					dest: '<%=dir.public%>/img'
				]
			portrait:
				options:
					optimizationLevel: 6
				files: [
					expand: true
					cwd:'<%=dir.src%>/images'
					src: ['**/prof.png','**/portrait.png']
					dest: '<%=dir.public%>/img'
				]



		
		#データ共有とか
		copy:
			#libminにデータをおけば、src,public両方のcssとjsのライブラリが更新されるよ
			css__src:
				expand: true
				cwd: '<%=dir.libmin%>'
				src: '*.css'
				dest:'<%=dir.src%>/css/lib'
			js__src:
				expand: true
				cwd: '<%=dir.libmin%>'
				src: '*.js'
				dest:'<%=dir.src%>/js/lib'
			css_public:
				expand: true
				cwd: '<%=dir.libmin%>'
				src: '*.css'
				dest:'<%=dir.public%>/css/lib'
			js_public:
				expand: true
				cwd: '<%=dir.libmin%>'
				src: '*.js'
				dest:'<%=dir.public%>/js/lib'
			#phpはコンパイルすることがないので、暫定的にここでpublicまでコピーするよ
			php:
				expand: true
				cwd: '<%=dir.src%>/php'
				src: ['**/*.php']
				dest: '<%=dir.public%>'
			xml:
				expand: true
				cwd: '<%=dir.src%>/xml'
				src: ['*.xml']
				dest: '<%=dir.public%>/xml'
			#img:
			#	expand: true
			#	cwd: '<%=dir.src%>/images'
			#	src: ['**/*.{png,gif,jpg}']
			#	dest: '<%=dir.public%>/img'

	

		#jsライブラリの更新（怖いのでデータの取得後、手動で更新しないと反映されません）
		bower:
			install:
				options:
					targetDir: 'lib_bower'
					layout: 'byType'
					install: true
					verbose: false
					cleanTargetDir: false
					cleanBowerDir: false

		connect:
			server:
				options:
					port: 9004
					hostname: 'localhost'
					base: '<%=dir.public%>'
					open: true

		browserSync:
			dev:
				bsFiles:
					src: '<%=dir.public%>/css/*.css' 
				options:
					watchTask: true
					server: '<%=dir.public%>'

		esteWatch:
			options:
				dirs: [
					"<%=dir.src%>/_jade/**"
					"<%=dir.src%>/_jadexml/**"
					"<%=dir.src%>/js/"
					"<%=dir.src%>/_stylus/**"
					"<%=dir.src%>/xml/**"
				]
				livereload:
					enabled: true
					extensions: ['html', 'xml', 'jade', 'css','stylus', 'js']
					port: 35729
			"jade": (path) ->
				['newer:jade','newer:htmlmin','newer:copy:xml']

			"xml": (path) ->
				['copy:xml']

			"stylus": (path) ->
				['newer:stylus','newer:autoprefixer','newer:cssmin']

			#"coffee": (path) ->
			#	['newer:coffee','newer:concat','newer:uglify']
			#"js": (path) ->
			#	['newer:concat','newer:uglify']
			"js": (path) ->
				['newer:uglify']


		# git関連のコマンド
		gitadd :
			task :
				files :
					src : ["<%=dir.src%>/**"]	

		gitcommit :
			options :
				message :  grunt.option('M')
				#message : 'どうですか'
			files :
				src : ["<%=dir.src%>/**"]
				expand : true
				cwd : ""


		#使えるらしい、パッケージのバージョンアップに特化したやつ　$ grunt release:minor　とかで叩くらしい
		release:
			options:
				additionalFiles: ['bower.json']
				npm: false

	grunt.loadNpmTasks 'grunt-bower-task'
	grunt.loadNpmTasks 'grunt-contrib-copy'
	grunt.loadNpmTasks 'grunt-contrib-jade'
	grunt.loadNpmTasks 'grunt-contrib-htmlmin'
	grunt.loadNpmTasks 'grunt-contrib-stylus'
	grunt.loadNpmTasks 'grunt-contrib-cssmin'
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-imagemin'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-encoding'
	grunt.loadNpmTasks 'grunt-autoprefixer'

	grunt.loadNpmTasks 'grunt-contrib-connect'
	grunt.loadNpmTasks 'grunt-contrib-livereload'
	#grunt.loadNpmTasks 'grunt-browser-sync'

	grunt.loadNpmTasks 'grunt-este-watch'
	grunt.loadNpmTasks 'grunt-newer'
	grunt.loadNpmTasks 'grunt-release'
	grunt.loadNpmTasks 'grunt-git'
	grunt.registerTask 'make', [ 
		#'bower', 
		'copy', 
		#'newer:imagemin',
		'newer:jade', 'newer:htmlmin',
		'newer:stylus', 'newer:autoprefixer', 'newer:cssmin',
		#'newer:coffee', 
		#'newer:concat', 
		'newer:uglify'
	]
	grunt.registerTask 'refresh', [ 
		'bower', 'copy',
		#'imagemin',
		'jade', 'htmlmin',
		'stylus', 'autoprefixer', 'cssmin',
		'coffee', 'concat', 'uglify'
	]
	grunt.registerTask 'default', ['make', 'connect','esteWatch']
	#マルチデバイス用コマンド。mbaだとリソースを食い過ぎるので、常用はできない。
	grunt.registerTask 'multiDevice', ['make', 'connect','browserSync', 'esteWatch']