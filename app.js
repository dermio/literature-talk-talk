// ThinkDive API and endpoint info
const API_KEY_TASTEDIVE = "280012-Booksand-1ZFHAWKT";
const ENDPOINT_TASTEDIVE = "https://tastedive.com/api/similar";

// YouTube API and endpoint info
const API_KEY_YOUTUBE = "AIzaSyDf9VtvE5wTSJyzYAfmWV6GJd_vzSa3r2w";
const ENDPOINT_YOUTUBE = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_WATCH_VID = "https://www.youtube.com/watch?v=";

const MY_DATA = {
	tastedive: null,
	youtube: []
};



function equalizeHeaderTextHeights() {
	let headerTextArr = $(".headerText");
	let headerText1;
	let headerText2;
	let headerTextHeight1;
	let headerTextHeight2;
	let maxHeight;

	// console.log(headerTextArr);

	for (let i = 1; i < headerTextArr.length; i += 2) {
		headerText1 = $(headerTextArr[i - 1]);
		headerText2 = $(headerTextArr[i]);
		headerTextHeight1 = parseInt($(headerText1).css("height").match(/\d+/));
		headerTextHeight2 = parseInt($(headerText2).css("height").match(/\d+/));

		maxHeight = Math.max(headerTextHeight1, headerTextHeight2);

		headerText1.css("height", `${maxHeight}px`);
		headerText2.css("height", `${maxHeight}px`);
	}
}

function equalizeTitleHeights() {
	// Returns an array of jQuery objects targeting the element
	// with a class of "title-name".
	let titleArr = $(".title-name");
	let title1;
	let title2;
	let titleHeight1;
	let titleHeight2;
	let maxHeight;

	// console.log(titleArr);
	/*
	titleArr.each(function (index, element) {
		console.log($(element).css("height")); // can use element or this keyword
	});
	*/

	// Need to wrap titleArr[i] in $(), because titleArr[i]
	// is a HTML element. Need to convert the HTML element into
	// a jQuery object to use jQuery methods.
	for (let i = 1; i < titleArr.length; i += 2) {
		title1 = $(titleArr[i - 1]);
		title2 = $(titleArr[i]);
		titleHeight1 = parseInt(title1.css("height").match(/\d+/));
		titleHeight2 = parseInt(title2.css("height").match(/\d+/));
		//console.log(titleHeight1, titleHeight2);

		maxHeight = Math.max(titleHeight1, titleHeight2);
		//console.log(maxHeight);

		title1.css("height", `${maxHeight}px`);
		title2.css("height", `${maxHeight}px`);
	}


	// Need event listener for Window resizing
	// https://api.jquery.com/resize/
	// i.e.: $(window).resize(callback);
}

function toggleText() {
	$(".js-results").on("click", ".showMore, .showLess", function () {
		$(this).parent(".teaserText")
					 .children(".showMore, .remainingText, .showLess")
					 .toggleClass("hideText");
	});
}

function displaySearchResults() {
	// Create empty string. Will populate the string with HTML markup
	// with the data from MY_DATA.tastedive and MY_DATA.youtube
	let htmlString = "";

	// MY_DATA.tastedive contains two arrays.
	// Create tempArr for the TasteDive arrays to make looping easier
	// by concatenating the Info and Results arrays.
	let tempInfoArr = MY_DATA.tastedive.Similar.Info;
	let tempResultsArr = MY_DATA.tastedive.Similar.Results;
	let tempArrTD = tempInfoArr.concat(tempResultsArr);

	// Variables will contain data from the YouTube API.
	let ytVideoId;
	let ytThumbNail;
	let ytImgAlt;
	let ytTitle;

	// Variables will contain data from TasteDive API wTeaser string.
	let headerText;
	let remainingText;

	for (let i = 0; i < tempArrTD.length; i++) {
		// ytVideoId and ytThumbNail will be assigned to the appropriate
		// values from MY_DATA.youtube JSON data.
		// The values will be used for the YouTube video link, thumbnail, and alt.

		ytVideoId = MY_DATA.youtube[i].items[0].id.videoId;
		ytThumbNail = MY_DATA.youtube[i].items[0].snippet.thumbnails.high.url;
		ytImgAlt = MY_DATA.youtube[i].items[0].snippet.title;
		ytTitle = MY_DATA.youtube[i].items[0].snippet.title;
		//ytTitle, place under .img-container

		headerText = tempArrTD[i].wTeaser.slice(0, 350);
		remainingText = tempArrTD[i].wTeaser.slice(350);

		htmlString +=
		 `<div class="col-6">
				<div class="js-single-result">
					<h4 class="title-name">${tempArrTD[i].Name}</h4>

					<div class="img-container">
						<a href="${YOUTUBE_WATCH_VID}${ytVideoId}" target="_blank" class="vid">
							<img src="${ytThumbNail}" alt="${ytImgAlt}" class="img-vid">
						</a>
						<div class="overlay">
							<i class="fa fa-youtube-play fa-3x" aria-hidden="true"></i>
						</div>
					</div>
					
					<div class="media-wiki-container">
						<p class="media-content">
							<span class="media-word">Media: </span>${tempArrTD[i].Type}
						</p>
						<p class="wiki-para">
							<i class="fa fa-wikipedia-w" aria-hidden="true"></i>
							<a class="wiki-link" href="${tempArrTD[i].wUrl}" target="_blank">Wikipedia page</a>
						</p>
					</div>

					<p class="teaserText">
						<span class="headerText">${headerText}</span>
						<span class="remainingText hideText toggle">${remainingText}</span>
						<br />
						<span class="showMore toggle">click for more...</span>
						<span class="showLess hideText toggle">click to hide...</span>
					</p>
				</div>
			</div>`;
	}

	$(".js-results").html(htmlString);
	equalizeTitleHeights();
	equalizeHeaderTextHeights();
	toggleText(); // watch clicking on text, to show/hide more text
}

function createArrNamesFromTasteDive() {
	// Create empty array.
	let myArr = [];

	// Loop through MY_DATA.tastedive.Similar.Info array
	// and MY_DATA.tastedive.Similar.Results array.
	// Push the Name key from each element into myArr
	let infoArr = MY_DATA.tastedive.Similar.Info;
	let resultsArr = MY_DATA.tastedive.Similar.Results;

	infoArr.forEach(elem => {myArr.push(elem.Name);} );
	resultsArr.forEach(elem => {myArr.push(elem.Name);} );

	return myArr;
}

function getDataYouTubeAPI() {
	// check if any results were returned for the query in the Results array
	// for the TasteDive API (check the length of the Results array)
	let arrResultsTD = MY_DATA.tastedive.Similar.Results;

	if (arrResultsTD.length === 0) {
		$(".js-results").html(
			 `<div class="js-single-result">
					<p>There are no results for this query.</p>
					<p>Please try again.</p>
				</div>`
		);

		// Do NOT perform getJSON() for YouTube API.
		// return to exit this function.
		return undefined;
	}

	// Call createArrNamesFromTasteDiveAPI() to create an array of Names
	// from the TasteDive API call
	let arrNames = createArrNamesFromTasteDive();

	// Empty the array in MY_DATA.youtube in case
	// there are previous results
	MY_DATA.youtube = [];

	// For each element in arrNames, keep track of the promise
	// for the getJSON call. Below, will use Promise.all()
	// on arrNames which will then call displaySearchResults()
	let promises = []; // keep track of all promises

	arrNames.forEach(function (elem, index) {
		// arrNames contains an array of string Names from the TasteDive API.
		// each elem string Name will serve as the query search term
		// for the getJSON to the YouTube API

		let dataYouTubeAPI = {
			part: "snippet", // part: "snippet" required by YouTube data API
			key: API_KEY_YOUTUBE,
			q: elem + "book", // the element, it is a string name

			// get 1 result for each element
			maxResults: 1,
			//order: "relevance" // new
		};


		// use getJSON for each element
		let req = $.getJSON(ENDPOINT_YOUTUBE, dataYouTubeAPI, function (data) {
			MY_DATA.youtube.push(data);
		});

		promises.push(req);

	});

	// When all the promises in the promises array are fulfilled,
	// call displaySearchResults().
	Promise.all(promises).then(function () {
		displaySearchResults();
	});

}

function getDataTasteDiveAPI(searchTerm) {
	// data sent with $.ajax() to TasteDive
	let dataTasteDiveAPI = {
		k: API_KEY_TASTEDIVE,
		q: searchTerm,
		// q: searchterm, ???
		type: "books",
		limit: 5,

		info: 1 // extra, verbose=1
	};

	// .ajax() call for TasteDive API
	$.when(
	  $.ajax({
		  type: "GET",
		  url: ENDPOINT_TASTEDIVE,

		  jsonp: "callback", // get around CORS
		  dataType: "jsonp", // get around CORS
		  data: dataTasteDiveAPI, // variable defined above

		  success: function (data) {
		  	// store returned JSON data in object MY_DATA.tastedive
		   	MY_DATA.tastedive = data;
		  }
		})
	).then(function () {
		// wait to get JSON data from TasteDive API before
		// calling getDataYouTubeAPI
	 	getDataYouTubeAPI();
	});
}

function watchSubmit() {
  $(".submitBookSearch").on("submit", function (event) {
    event.preventDefault();
    
		let queryTarget = $(this).find("#searchBook"); // input field
		let queryTerm = queryTarget.val(); // get the search term
		
		queryTarget.val(""); // empty search field

    getDataTasteDiveAPI(queryTerm); // function call
  });
}

$(watchSubmit);

/////////