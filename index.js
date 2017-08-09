// ThinkDive API and endpoint info
const API_KEY = '280012-Booksand-1ZFHAWKT';
const ENDPOINT_URL = 'https://tastedive.com/api/similar';


function renderErrorMessage() {
	console.log('renderErrorMessage() called');
	// render error or invalid message

	return `<p>Sorry there are no results for this book.</p>
					<p>Would you like to try again?<p>`;
}

function renderResult(result) {
	console.log('renderResult() called');
	// render each book item(s)

	return `<p>${result.Name}</p>`;
}

function displaySearchResults(dataJSON) {
	console.log('displaySearchResults() called')
	// Will render the search results from dataJSON
	// Will call renderResult() or renderErrorMessage()

	console.log(dataJSON);
	let resultsList = dataJSON.Similar.Results; // the array with Results

	let message; // Will contain book results, or error message

	// If no valid results were found (array length is zero),
	// call renderResult() once with an error or invalid message.
	// Otherwise map() over list array with renderResult()
	// to display all the books
	if (resultsList.length !== 0) {
		message = resultsList.map((elem) => {return renderResult(elem);});
	} else {
		message = renderErrorMessage();
	}

	//renderResult();
	$('.js-results').html(message);
}

function getDataFromAPI(searchTerm, callback) {
	console.log('getDataFromAPI() called');
	// will get JSON data back from server
	// hand off the success or failure to displaySearchResults()

	console.log(searchTerm);
	
	let parameter = {
		k: API_KEY,
		q: searchTerm,
		type: 'books',
		limit: 10
	};

	// Need to use JSONP to get around Cross-origin resource sharing
	// So use the 'jsonp' and 'dataType' properties
	$.ajax({
	  //type: 'GET',
	  url: 'https://tastedive.com/api/similar',

	  jsonp: 'callback',  // get around CORS
	  dataType: 'jsonp',  // get around CORS
	  data: parameter, // defined above

	  success: callback // callback is displaySearchResults()
	});
}

function watchBookSubmit() {
	console.log('watchBookSubmit() called');
	// when text is entered in the search field
	// and the form is submitted,
	// call getDataFromAPI() that handles the AJAX request to server

	$('.submitBookSearch').on('submit', function (event) {
		event.preventDefault();
		//console.log('Submit button clicked');

		let queryTarget = $(this).find('#searchBook'); // input field
		let queryBook = queryTarget.val(); // get the book value entered
		//console.log(queryBook);

		queryTarget.val(''); // empty the input field of text
		
		getDataFromAPI(queryBook, displaySearchResults);
	});
}

// render Home Screen

$(watchBookSubmit);

//////////