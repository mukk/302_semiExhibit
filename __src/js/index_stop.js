(function() {

	'use strict';

	var wavebox,gui,parameters;
	var composer,precomposer, finalPass;
	var webgl_flg = false;
	var MAX_X = 50;
	var MAX_Y = 40;
	var frameAmp = 35;
	var amp = 4;
	var waveWidth=7000;
	var waveHeight=4000;
	
	var k = 0.65;

	var attenuation = 0.75;

	parameters =
	{
		dotscreenAngle: 2.85, dotscreenScale: 0.1,
		useShaderNone:      function() { setupShaderDotScreen(); },
		useShaderDotScreen: function() { setupShaderDotScreen(); }

	};

	if(_ua.Mobile){
		MAX_X = 22;
		frameAmp = 30;
		k = 0.4;
		attenuation = 0.9;
		webgl_flg = true;
		parameters.dotscreenScale= 1.3;
	}else if(_ua.Tablet){
		MAX_X = 60;
		MAX_Y = 60;
		frameAmp = 30;
		parameters.dotscreenScale= 0.4;
	}else{
		if(screen.width<=1400){MAX_X = 400;MAX_Y = 700;frameAmp = 35;}
		else if(screen.width<=1700){MAX_X = 140;MAX_Y = 30;frameAmp = 23;}
		else if(screen.width<=2000){MAX_X = 180;MAX_Y = 40;frameAmp = 21;}
		else if(screen.width<=2300){MAX_X = 220;MAX_Y = 50;frameAmp = 19;}
	}

	if(!webgl_flg){
		var HALF_X =Math.round(MAX_X/2);
		var HALF_Y =Math.round(MAX_Y/2);



		var U = [];
		var Vel = [];

		for (var x = 0; x < MAX_X; x++) {
			U[x]   = [];
			Vel[x] = [];
			for (var y = 0; y < MAX_Y; y++) {
				U[x][y] = 0;
				Vel[x][y] = 0;
			}
		}

		



		function updateWave() {
			for (var x = 1; x < MAX_X - 1; x++) {
				for (var y = 1; y < MAX_Y - 1; y++) {
					var accel = U[x  ][y-1]
							  + U[x  ][y+1]
							  + U[x-1][y  ]
							  + U[x+1][y  ]
							  - U[x  ][y  ] * 4;
					accel *= k;
					Vel[x][y] = (Vel[x][y] + accel) * attenuation;

				}
			}
			


			for (var x = 0; x < MAX_X - 1; x++) {
				for (var y = 0; y < MAX_Y - 1; y++) {
					U[x][y] += Vel[x][y];
					var idx = y + (MAX_Y * x);
					Vel[0][y]/=2;
					Vel[0][MAX_Y-1]/=2;

					geometry.vertices[idx].z = U[x][y];


				}
				Vel[x][0]/=2;
				Vel[MAX_X-1][0]=2;
			}

			geometry.computeFaceNormals();
			geometry.verticesNeedUpdate = true;
			geometry.normalsNeedUpdate  = true;
			geometry.uvsNeedUpdate      = true;
		}

		// conteiner
		wavebox = document.getElementById( 'Wave_stop' );

		var renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setClearColor(0xffffff,1.0);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize( waveWidth, waveHeight);
		var element =renderer.domElement;

		

		wavebox.appendChild(element);


		function initShaderNone()
		{
			shaderActive = "none";
			// var effectDotScreen = new THREE.DotScreenPass( new THREE.Vector2(0,0), parameters.dotscreenAngle, parameters.dotscreenScale ); 
			// effectDotScreen.renderToScreen = true; 
			// composer.addPass(effectDotScreen); 
		}


		function initShaderDotScreen()
		{
			composer = new THREE.EffectComposer( renderer );
			composer.addPass( new THREE.RenderPass( scene, camera ) );
			
			var effectDotScreen = new THREE.DotScreenPass( new THREE.Vector2(0,0), parameters.dotscreenAngle, parameters.dotscreenScale ); 
			effectDotScreen.renderToScreen = true; 
			composer.addPass(effectDotScreen); 
		}

		var scene  = new THREE.Scene();
		var VIEW_ANGLE = 20, ASPECT = waveWidth / waveHeight, NEAR = 1, FAR = 2000;
		var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		camera.position.z = 600;
		// var camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 1, 300 );
		// var camera = new THREE.OrthographicCamera( waveWidth / - frameAmp, waveWidth / frameAmp, waveHeight / frameAmp, waveHeight / - frameAmp, 1, 300 );

		// camera.position.z = 100;
		
		camera.position.x = 0;
		camera.position.y = 0;
		camera.lookAt(new THREE.Vector3(0, 0, 0));

		var circle = [];
		var geometry = new THREE.Geometry();
		var material = new THREE.MeshLambertMaterial({
			color    : 0xffffff
		});

		var uvs = [];
		var w = MAX_X-1;
		var h = MAX_X-1;
		for (var i = 0; i < MAX_X; i++) {
			var amp_i =i*amp;
			for (var j = 0; j < MAX_Y; j++) {
				var amp_j =j*amp;
				geometry.vertices.push(new THREE.Vector3( amp_i, amp_j, 0));
			}
		}
		
		for (var i = 0; i < MAX_Y - 1; i++) {
			for (var j = 0; j < MAX_X - 1; j++) {
				x + (MAX_X * y)
				var idx0 = i + (MAX_Y*j);
				var idx1 = idx0 + 1;
				var idx2 = idx0 + MAX_Y;
				var idx3 = idx1 + MAX_Y;
				geometry.faces.push(new THREE.Face3(idx1, idx0, idx2));
				geometry.faces.push(new THREE.Face3(idx1, idx2, idx3));

			}

		}


		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.x -= HALF_X*amp ;
		mesh.position.y -= HALF_Y*amp ;
		scene.add(mesh);

		var spot1 = new THREE.SpotLight(0x0000ff);
		spot1.position.set(200, -100, 100);
		spot1.target.position.set(0,100,0);
		scene.add(spot1);

		var spot2 = new THREE.SpotLight(0xff0000);
		spot2.position.set(0, -100, 80);
		spot2.target.position.set(-100,0,10);
		scene.add(spot2);

		var spot3 = new THREE.SpotLight(0x00ff00);
		spot3.position.set(90, -50, 60);
		spot3.target.position.set(170,170,0);
		scene.add(spot3);

		var ambient = new THREE.AmbientLight(0x000010);
		scene.add(ambient);

		// function pulse(){
		// 	var rand_x =HALF_X+Math.round((Math.random()-0.5)*8);
		// 	var rand_y =HALF_Y+Math.round((Math.random()-0.5)*6);
		// 	U[rand_x][rand_y] += 10;
		// }

		function OnMouseDown(e){
			var m_x = Math.round((e.clientX/window.innerWidth)*MAX_X);
			var m_y = Math.round((e.clientY/window.innerHeight)*MAX_Y);
			U[m_x][MAX_Y-m_y] += 20;


		}
		function OnMouseMove(e){
			var m_x = Math.round((e.clientX/window.innerWidth)*MAX_X);
			var m_y = Math.round((e.clientY/window.innerHeight)*MAX_Y);
			U[m_x][HALF_Y] += 1;

		}
		function TouchStart(e){
			var m_x = Math.round((e.changedTouches[0].pageX/window.innerWidth)*MAX_X);
			var m_y = Math.round((e.changedTouches[0].pageY/window.innerHeight)*MAX_Y);
			U[m_x][MAX_Y-m_y] += 10;
		}
		function TouchMove(e){
			var m_x = Math.round((e.changedTouches[0].pageX/window.innerWidth)*MAX_X);
			var m_x = Math.round((e.changedTouches[0].pageY/window.innerHeight)*MAX_Y);
			U[m_x][MAX_Y-m_y] += 10;
		}

		document.addEventListener('mousedown', OnMouseDown, false);
		document.addEventListener('mousemove', OnMouseMove, false);
		document.addEventListener('touchstart', TouchStart, false);
		document.addEventListener('touchmove', TouchMove, false);
		document.addEventListener('resize', function(){initShaderNone();}, false);
		THREEx.WindowResize(renderer, camera);
		// THREEx.WindowResize(composer, camera);

		// initShaderDotScreen();
		
		// var prevTime = Date.now();
		// (function loop() {
		// 	if(!webgl_flg){
		// 	// composer.render();
		// 	renderer.render(scene,camera);
		// 	updateWave();
		// 	setTimeout(loop, 100);
		// 	}
		// }());
		for (var i = 0; i < 9; i++) {
			if(i==1)U[HALF_X-5][HALF_Y] = 5;U[HALF_X+20][HALF_Y-10] = 2;
			if(i==5)U[HALF_X-100][HALF_Y+80] = -1;
			renderer.render(scene,camera);
			updateWave();
		}
		renderer.render(scene,camera);
	}
}());