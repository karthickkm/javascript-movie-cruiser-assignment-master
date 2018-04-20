
function getMovies() {
	var url = "http://localhost:3000/movies";
	let promise = new Promise((resolve, reject) => {
    fetch(url).then(response => {
      if (response.ok) {
       	response.json().then(obj => {
			groupData(obj, 'moviesList');
			resolve(obj);
		}, error => {
			reject(new ResponseError('Invalid JSON: ' + error.message));
		});
      } else {
        if (response.status == 404) {
          reject(new NotFoundError('Page not found: ' + url));
        } else {
          reject(new HttpError('HTTP error: ' + response.status));
        }
      }
    }, error => {
      reject(new NetworkError(error.message));
    });
  });

  return promise;
}

function getFavourites() {
	var url = "http://localhost:3000/favourites";
	let promise = new Promise((resolve, reject) => {
    fetch(url).then(response => {
      if (response.ok) {
       	response.json().then(obj => {
			groupData(obj, 'favouritesList');
			resolve(obj);
		}, error => {
			reject(new ResponseError('Invalid JSON: ' + error.message));
		});
      } else {
        if (response.status == 404) {
          reject(new NotFoundError('Page not found: ' + url));
        } else {
          reject(new HttpError('HTTP error: ' + response.status));
        }
      }
    }, error => {
      reject(new NetworkError(error.message));
    });
  });

  return promise;
}

function getFavourites1(id) {
	var url = "http://localhost:3000/favourites/"+id;
	let promise = new Promise((resolve, reject) => {
    fetch(url).then(response => {
      if (response.ok) {
       	response.json().then(obj => {
			//groupData(obj, 'favouritesList');
			resolve(obj);
		}, error => {
			reject(new Error('Invalid JSON: ' + error.message));
		});
      } else {
        if (response.status == 404) {
          reject(new Error('Page not found: ' + url));
        } else {
          reject(new Error('HTTP error: ' + response.status));
        }
      }
    }, error => {
      reject(new Error(error.message));
    });
  });

  return promise;
}

function groupData(arr, itemDispId) {
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
		if(itemDispId == 'moviesList') {
			out += '<li class=\'item-list\'>' + arr[i].id +' | '+ arr[i].title +' | '+ arr[i].posterPath + ' <i class="fa fa-heart" aria-hidden="true" onclick=addFavourite('+arr[i].id+')></i> </li>';
		} else {
			out += '<li class=\'item-list\'>' + arr[i].id +' | '+ arr[i].title +' | '+ arr[i].posterPath + '></li>';
		}
   	}
	document.getElementById(itemDispId).innerHTML = out;
}

function postData(id) {
	var newmovie = {};
	
	fetch('http://localhost:3000/movies/'+id)
	.then(
		function(response) {
			if (response.status !== 200) {
				console.log('Looks like there was a problem. Status Code: ' +response.status);
				return;
			}

			response.json().then(
				function(data) {
					console.log(data);
					newmovie.title = data.title;
					newmovie.posterPath = data.posterPath;
					console.log('New moview : '+JSON.stringify(newmovie));

					var url = 'http://localhost:3000/favourites';
					
					fetch(url, {
						method: 'POST', 
						body: JSON.stringify(newmovie), // newmovie can be `string` or {object}!
						headers: new Headers({
							'Content-Type': 'application/json'
						})
					})
					.then(
						function(response) {
							fetch('http://localhost:3000/favourites')
							.then(
								function(response) {
								if (response.status !== 200) {
									console.log('Looks like there was a problem. Status Code: ' +response.status);
									return;
								}
								response.json().then(function(data) {
									console.log(data);
									groupData(data, 'favouritesList');
									//done();
								});
								}
							)
							.catch(function(err) {
								console.log('Fetch Error :-S', err);
							});
							//done();
						}
					)
					.catch(function(err) {
						console.log('Fetch Error :-S', err);
					});
					
				});
			
		}
	)
	.catch(function(err) {
		console.log('Fetch Error :-S', err);
	});

}

function addFavourite(id) {

	let promise = new Promise((resolve, reject) => {

		getFavourites1(id)
		.then(res => {
			reject(new Error('Movie is already added to favourites'));
		})
		.catch(err => {
			console.log(err.message);
			
		});



		// fetch(url).then(response => {
		//   if (response.ok) {
		// 	   response.json().then(obj => {
		// 		//groupData(obj, 'favouritesList');
		// 		resolve(obj);
		// 	}, error => {
		// 		reject(new ResponseError('Invalid JSON: ' + error.message));
		// 	});
		//   } else {
		// 	if (response.status == 404) {
		// 	  reject(new NotFoundError('Page not found: ' + url));
		// 	} else {
		// 	  reject(new HttpError('HTTP error: ' + response.status));
		// 	}
		//   }
		// }, error => {
		//   reject(new NetworkError(error.message));
		// });
	});
	
	return promise;


	
}

module.exports = {
	getMovies,
	getFavourites,
	addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution


