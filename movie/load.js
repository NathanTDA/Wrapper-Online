const movie = require('./main');
const base = Buffer.alloc(1, 0);

module.exports = function (req, res, url) {
	switch (req.method) {
		case 'GET': {
			const match = req.url.match(/\/movies\/([^.]+)(?:\.(zip|xml))?$/);
			if (!match) return;

			var id = match[1], ext = match[2];
			switch (ext) {
				case 'zip':
					res.setHeader('Content-Type', 'application/zip');
					movie.loadZip(id).then(v => { res.statusCode = 200, res.end(v) })
						.catch(e => { res.statusCode = 404, res.end() })
					break;
				default:
					res.setHeader('Content-Type', 'text/xml');
					movie.loadXml(id).then(v => { res.statusCode = 200, res.end(v) })
						.catch(e => { res.statusCode = 404, res.end() })
			
			
			.then(v => { res.statusCode = 200, res.end(0 + v) })
					//.catch(e => { res.statusCode = 404, res.end(1 + e) })
	
					.catch(
						() => movie.load('m-000001')
						.then(v => {
							console.log("Couldn't find that character, but it's okay, we loaded the 404 error"),
							res.statusCode = 200, res.end(0 + v)
						})
					).catch(e => {
						console.log("But nobody came."),
						res.statusCode = 404, res.end(1 + e)
					});
			});
			return true;
		}

		case 'POST': {
			if (!url.path.startsWith('/goapi/getMovie/')) return;
			res.setHeader('Content-Type', 'application/zip');
			process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

			movie.loadZip(url.query.movieId).then(b =>
				res.end(Buffer.concat([base, b]))
			).catch(e => res.end('1'));
			return true;
		}
		default: return;
	}
}
