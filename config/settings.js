var dev = {
	webServer:{
		options:{
			port:8000,
			template_dir:'/../../templates'
		},
		routing:[
			{
				regex:'^\\/css\\/(\\w+\\.css)?',
				type:'static',
				method:'get',
				headers:function(headers, params) {
					return {
						'Content-Type':'text/css'
					}	
				},
				path: function(params) {
					return '/../../public/css/' + params[0]
				}
			},
			{
				regex:'^(\\/js(\\/lib)?(\\/[\\w\\-\\.]+\\.js))',
				type:'static',
				method:'get',
				headers: function(headers, params) {
					return {
						'Content-Type':'application/javascript'
					}
				},
				path: function(params) {
					return '/../../public' + params[0]
				}
			},
			{
				regex:'^\\/js\\/shared(\\/[\\w\\-\\.]+\\.js)',
				type:'static',
				method:'get',
				headers: function(headers, params) {
					return {
						'Content-Type':'application/javascript'
					}
				},
				path: function(params) {
					return '/shared' + params[0]
				}
			},
			{
				regex:'^\\/docs\\/([\\w\\-\\.]+\\.(css|html))?$',
				type:'static',
				method:'get',
				headers: function(headers, params) {
					return {
						'Content-Type':'text/' + (params[1] === 'css' ? 'css' : 'html')
					}
				},
				path: function(params) {
					var path = '/../../public/docs/';
					if (!params[0]) {
						return path += 'index.html';
					}
					return '/../../public/docs/' + params[0];
				}
			},
			{
				regex:'^\\/config/$',
				type:'dynamic',
				method:'get',
				headers: function(headers, params) {
					return {
						'Content-Type':'text/html'
					}	
				},
				model: 'config',
				template: 'config'
			},
			{
				regex:'^\\/$',
				type:'dynamic',
				method:'get',
				headers: function(headers, params) {
					return {
						'Content-Type':'text/html'
					}	
				},
				model: 'defaultData',
				template: 'multiply'
			},
			{
				regex:'^(\\/[\\w\\-\\.]+)$',
				type:'302',
				method:'get',
				headers:function(headers, params) {
					return {
						'Location':params[0] + '/'
					}
				}
				
			},	
			{
				regex:'^.*?',
				method:'get',
				type:'404',
				headers:function(headers, params) {
					return {}
				}
			},
			{
				regex:'\\/',
				method:'post',
				headers:function(headers, params) {
					return {
						'Content-Type':String(headers['content-type']).indexOf('json') >= 0 ? 'application/json' : 'text/html'
					}
				},
				model: 'multiplyData',
				template: 'multiply'
			}
		]
	}
};
