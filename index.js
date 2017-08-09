// ThinkDive API and endpoint info
const API_KEY = '280012-Booksand-1ZFHAWKT';
const ENDPOINT_URL = 'https://tastedive.com/api/similar';


function renderErrorMessage() {
	console.log('renderErrorMessage() called');
	// render error or invalid message
}

function renderResult() {
	console.log('renderResult() called');
	// render each book item(s)

}

function displaySearchResults() {
	console.log('displaySearchResults() called')
	// Will render the search results from dataJSON
	// Will call renderResult() or renderErrorMessage()

	renderResult();
	renderErrorMessage();
}

function getDataFromAPI(searchTerm, callback) {
	console.log('getDataFromAPI() called');
	// will get JSON data back from server
	// hand off the success or failure to displaySearchResults()

	displaySearchResults();
}

function watchBookSubmit() {
	console.log('watchBookSubmit() called');
	// when text is entered in the search field
	// and the form is submitted,
	// call getDataFromAPI() that handles the AJAX request to server

	getDataFromAPI();
}

// render Home Screen

$(watchBookSubmit);

//////////