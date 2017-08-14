// ThinkDive API and endpoint info
const API_KEY_TASTEDIVE = '280012-Booksand-1ZFHAWKT';
const ENDPOINT_TASTEDIVE = 'https://tastedive.com/api/similar';

// YouTube API and endpoint info
const API_KEY_YOUTUBE = 'AIzaSyDf9VtvE5wTSJyzYAfmWV6GJd_vzSa3r2w';
const ENDPOINT_YOUTUBE = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_WATCH_VID = 'https://www.youtube.com/watch?v=';


const MY_DATA = {
	tastedive: null,
	youtube: null
};

/*
function displaySearchResults(jsonTasteDive, jsonYouTube) {
  return `<>from TasteDive API<>
          <>from TasteDive API<>
          <>from YOUTUBE API<>
          <>from TasteDive API<>`
}
*/

function renderResult(result, i) {
	// console.log('renderResult() called');
	// console.log(result);

	let myThumbNail = MY_DATA.youtube.items[i].snippet.thumbnails.default.url;
	let videoId = MY_DATA.youtube.items[i].id.videoId;

	console.log(MY_DATA.youtube.items[i].snippet);

		return `<div class='js-single-result'>
						<h4>${result.Name}</h4>

						<a href='${YOUTUBE_WATCH_VID}${videoId}' target='_blank'>
							<img src='${myThumbNail}' alt=''>
						</a>

						<p>${result.Type}</p>
						<p>${result.wTeaser}</p>
						<p><a href='${result.wUrl}' target='_blank'>
							Wikipedia
						</a></p>

					</div>`;
	
	/*
	if (boolean) {
	return `<div class='js-single-result'>
						<h4>${result.Name}</h4>

						<a href='${YOUTUBE_WATCH_VID}${videoId}' target='_blank'>
							<img src='${myThumbNail}' alt=''>
						</a>

						<p>${result.Type}</p>
						<p>${result.wTeaser}</p>
						<p><a href='${result.wUrl}' target='_blank'>
							Wikipedia
						</a></p>

					</div>`;
	} else {
	return `<div class='js-single-result'>
						<h4>${result.Name}</h4>

						<p>${result.Type}</p>
						<p>${result.wTeaser}</p>
						<p><a href='${result.wUrl}' target='_blank'>
							Wikipedia
						</a></p>
					</div>`;
	}
	*/
}

function renderErrorMessage() {
	// render error or invalid message

	return `<p>Sorry there are no results for this book.</p>
					<p>Would you like to try again?<p>`;
}

function displaySearchResults(stateData) {
	// stateData is the object with tastedive and youtube keys
	// console.log(stateData);

	let infoTDList = stateData.tastedive.Similar.Info; // single array
	let resultsTDList = stateData.tastedive.Similar.Results; // array
	// console.log(resultsTDList);

	console.log(stateData.youtube);

	let message; // Will contain book results, or error message

	// If valid results are found, Similar.Results length
	// is NOT zero. Map over the the list array in
	// Similar.Results.
	// Otherwise render an error message
	if (resultsTDList.length !== 0) {
		// console.log('Got results!');
		// call renderResult() w/ stateData as argument
		message = infoTDList.map((elem,i) => renderResult(elem,i)).join('');
		message += `<div class='js-single-result'>
									<h4>Similar topics...</h4>
								</div>`;
		message += resultsTDList.map((elem,i) => renderResult(elem,i)).join('');
	} else {
		// console.log('Error no results');
		message = renderErrorMessage();
	}

	// renderResult();
	$('.js-results').html(message);
}

// The functions below grab the data from their respective API calls
// and store it in an object MY_DATA

function getDataFromAPI(searchTerm) {
  // data sent with $.getJSON() to YouTube
  let dataYouTubeAPI = {
		part: 'snippet', // part: 'snippet' required by YouTube data API
		key: API_KEY_YOUTUBE,
		q: searchTerm,
		maxResults: 5
	};
	
	// data sent with $.ajax() to TasteDive
	let dataTasteDiveAPI = {
		k: API_KEY_TASTEDIVE,
		q: searchTerm,
		//type: 'books',
		limit: 5,

		info: 1 // extra, verbose=1
	};

	// Two .ajax() queries passed to when().
	// After data is sent back form both .ajax() queries
	// the callback function in then() will call
	// displaySearchResults(MY_DATA)
  $.when(
	  // $.getJSON() call for YouTube API
	  $.getJSON(ENDPOINT_YOUTUBE, dataYouTubeAPI, function (data) {
		  MY_DATA.youtube = data;
		}),
		
		// $.ajax() call for TasteDive API
	  $.ajax({
		  type: 'GET',
		  url: ENDPOINT_TASTEDIVE,

		  jsonp: 'callback',  // get around CORS
		  dataType: 'jsonp',  // get around CORS
		  data: dataTasteDiveAPI, // defined above

		  success: function (data) {
		   	MY_DATA.tastedive = data;
		  }
		})

	).then(function () {
		displaySearchResults(MY_DATA);
	});
  
  //console.log(dataFromYouTube);
}

function watchSubmit() {
  $('.submitBookSearch').on('submit', function (event) {
    event.preventDefault();
    
		let queryTarget = $(this).find('#searchBook'); // input field
		let queryBook = queryTarget.val(); // get the book value entered
		//console.log(queryBook);
		
		queryTarget.val('');
    
    console.log(queryBook);

    getDataFromAPI(queryBook); // function call
  });
}

$(watchSubmit);

/////////