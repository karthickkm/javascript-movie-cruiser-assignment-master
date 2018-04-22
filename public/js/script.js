
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

function getFavouritesById(id) {
	var url = "http://localhost:3000/favourites/"+id;
	let promise = new Promise((resolve, reject) => {
    fetch(url).then(response => {
      if (response.ok) {
				response.json().then(obj => {
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

function getMoviesById(id) {
	var url = "http://localhost:3000/movies/"+id;
	let promise = new Promise((resolve, reject) => {
    fetch(url).then(response => {
      if (response.ok) {
       	response.json().then(obj => {
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

function postMovie(newmovie) {
	var url = "http://localhost:3000/favourites/";
	let promise = new Promise((resolve, reject) => {
		fetch(url, {
			method: 'POST', 
			body: JSON.stringify(newmovie), // newmovie can be `string` or {object}!
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}).then(response => {
      if (response.ok) {
				 response.json().then(obj => {
			
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
			out += "<li>"+
				"<div class='container item-container'>"+
					"<div class='row'>"+
						"<div class='col-12 col-md-6 movie-disp'>"+
								"<img src='"+ arr[i].posterPath +"'  class='img-response'/>"+
						"</div>"+
						"<div class='col-12 col-md-6 movie-disp'>"+
								"<div><h4> "+ arr[i].title +" </h4></div>"+
								"<div>"+ arr[i].overview +"</div>"+
								"<div class='like'><i class='fa fa-heart' aria-hidden='true' title='Add to Favourites' onclick=addFavourite('"+arr[i].id+"')></i></div>"+
						"</div>"+
					"</div>"+
				"</div>"+
			"</li>";
		
		} else {
			out += "<li>"+
				"<div class='container item-container'>"+
					"<div class='row'>"+
						"<div class='col-12 col-md-6 movie-disp'>"+
								"<img src='"+ arr[i].posterPath +"'  class='img-response'/>"+
						"</div>"+
						"<div class='col-12 col-md-6 movie-disp'>"+
								"<div><h4> "+ arr[i].title +" </h4></div>"+
								"<div>"+ arr[i].overview +"</div>"+
						"</div>"+
					"</div>"+
				"</div>"+
			"</li>";
		}
   	}
	document.getElementById(itemDispId).innerHTML = out;
}

function addFavourite(id) {

	let promise = new Promise((resolve, reject) => {
		
		var url = "http://localhost:3000/favourites";
		fetch(url).then(response => {
      if (response.ok) {
       	response.json().then(favouritesObj => {
					var isExist = false;
					favouritesObj.forEach(element => {
						if(id == element.id) {
							isExist = true;
						}
					});
					if(!isExist) {
						console.log(favouritesObj);
						

						var url = "http://localhost:3000/movies";
						fetch(url).then(response => {
							if (response.ok) {
								response.json().then(obj => {
									var movieObj = {};
									obj.forEach(element => {
										if(id == element.id) {
											movieObj = element;
										}
									});
									
									console.log(movieObj);

									var url = "http://localhost:3000/favourites/";
									fetch(url, {
										method: 'POST', 
										body: JSON.stringify(movieObj), // newmovie can be `string` or {object}!
										headers: new Headers({
											'Content-Type': 'application/json'
										})
									}).then(response => {
										if (response.ok) {
											response.json().then(obj => {
												favouritesObj.push(obj);
												console.log(JSON.stringify(favouritesObj));
												groupData(favouritesObj, 'favouritesList');
												console.log(JSON.stringify(favouritesObj));
												resolve(favouritesObj);
										
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

					} else {
						reject(new Error('Movie is already added to favourites'));
					}
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

function addFavourite_test(id) {
	let promise = new Promise((resolve, reject) => {

		var url = "http://localhost:3000/favourites/";
		fetch(url).then(response => {
      if (response.ok) {
       	response.json().then(favouritesArray => {

					console.log(favouritesArray);
				
					var url = "http://localhost:3000/favourites/";
					fetch(url, {
						method: 'POST', 
						body: JSON.stringify({
							
								"voteCount": 0,
								"id": 476307,
								"video": false,
								"voteAverage": 0,
								"title": "The Unique Lama",
								"popularity": 1,
								"posterPath": "../images/The_Unique_Lama.jpg",
								"originalLanguage": "zh",
								"originalTitle": "Da la ma",
								"adult": false,
								"overview": "The Unique Lama is a 1978 Wuxia film from Taiwan",
								"releaseDate": "1978-09-15"
							
						}), // newmovie can be `string` or {object}!
						headers: new Headers({
							'Content-Type': 'application/json'
						})
					}).then(response => {
						if (response.ok) {
							console.log(response);
							response.json().then(obj => {
								console.log(obj);
								console.log(favouritesArray);
								favouritesArray.push(obj);
								console.log('After');
								console.log(favouritesArray);
								groupData(favouritesArray, 'favouritesList');
								resolve(favouritesArray);
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

function addFavourite_bk1(id) {

	let promise = new Promise((resolve, reject) => {

		getFavouritesById(id).then(res => {
			reject(new Error('Movie is already added to favourites'));
		})
		.catch(err => {
			console.log(err.message);
			
			getMoviesById(id).then(res => {
				console.log(res);
				
				postMovie(res).then(res => {
					console.log(JSON.stringify(res));

					getFavourites().then(res => {
						console.log(JSON.stringify(res));
						//resolve(obj);	
					})
					.catch(err => {
						console.log(err.message);
						reject(new Error('Error in get Favourites'));
					});	
				})
				.catch(err => {
					console.log(err.message);
					reject(new Error('Error in pushing the movie to Favourites'));
				});	
			})
			.catch(err => {
				console.log(err.message);
				reject(new Error('Error in getting the Movie object'));
			});	
		});
	});	
	return promise;	
}

// function postData(id) {
// 	var newmovie = {};
	
// 	fetch('http://localhost:3000/movies/'+id)
// 	.then(
// 		function(response) {
// 			if (response.status !== 200) {
// 				console.log('Looks like there was a problem. Status Code: ' +response.status);
// 				return;
// 			}

// 			response.json().then(
// 				function(data) {
// 					console.log(data);
// 					newmovie.title = data.title;
// 					newmovie.posterPath = data.posterPath;
// 					console.log('New moview : '+JSON.stringify(newmovie));

// 					var url = 'http://localhost:3000/favourites';
					
// 					fetch(url, {
// 						method: 'POST', 
// 						body: JSON.stringify(newmovie), // newmovie can be `string` or {object}!
// 						headers: new Headers({
// 							'Content-Type': 'application/json'
// 						})
// 					})
// 					.then(
// 						function(response) {
// 							fetch('http://localhost:3000/favourites')
// 							.then(
// 								function(response) {
// 								if (response.status !== 200) {
// 									console.log('Looks like there was a problem. Status Code: ' +response.status);
// 									return;
// 								}
// 								response.json().then(function(data) {
// 									console.log(data);
// 									groupData(data, 'favouritesList');
// 									//done();
// 								});
// 								}
// 							)
// 							.catch(function(err) {
// 								console.log('Fetch Error :-S', err);
// 							});
// 							//done();
// 						}
// 					)
// 					.catch(function(err) {
// 						console.log('Fetch Error :-S', err);
// 					});
					
// 				});
			
// 		}
// 	)
// 	.catch(function(err) {
// 		console.log('Fetch Error :-S', err);
// 	});

// }

module.exports = {
	getMovies,
	getFavourites,
	addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution


