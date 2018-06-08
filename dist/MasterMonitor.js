
(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();
	var myConnector = tableau.makeConnector();
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1; //jan = 0
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();
	var newdate = year + "-" + month + "-" + day;
	var fortnightPrior = new Date(Date.now() - 12096e5);
	var fnPmonth = fortnightPrior.getUTCMonth() + 1;
	var fnPday = fortnightPrior.getUTCDate();
	var fnPyear = fortnightPrior.getUTCFullYear();
	var fnPnewdate = fnPyear + "-" + fnPmonth + "-" + fnPday;


    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [
		{
            id: "startDate",
            alias: "Start Date",
            dataType: tableau.dataTypeEnum.string
		},
		{
            id: "Facebook",
            alias: "Facebook",
            dataType: tableau.dataTypeEnum.int
		},
		{
            id: "Twitter",
            alias: "Twitter",
            dataType: tableau.dataTypeEnum.int
		},
		{
            id: "Blogs",
            alias: "Blogs",
            dataType: tableau.dataTypeEnum.int
		},
		{
            id: "Forums",
            alias: "Forums",
            dataType: tableau.dataTypeEnum.int
		},
		{
            id: "News",
            alias: "News",
            dataType: tableau.dataTypeEnum.int
		},
		{
            id: "Reddit",
            alias: "Reddit",
            dataType: tableau.dataTypeEnum.int
		}
		];

         var schemas = {
		  id: "sources",
		  alias:
			"Top Sources: " +
			fnPnewdate +
			" - end: " +
			newdate,
		  columns: cols
    };
    schemaCallback([schemas]);
    };
 myConnector.getData = function(table, doneCallback) {
    // var dates = tableau.connectionData.split(';')[1];

    var apiCall =
      "http://localhost:8080/api.crimsonhexagon.com:443/api/monitor/sources?auth=MLEPJcowDQhpG08s2nIC2cvHgUiqjku3YUFkF4aAzAU&id=10692586370" +
      "&start=" + fnPnewdate + "&end=" + newdate;

    // tableau.log("dates: " + dates);
    tableau.log("api call: " + apiCall);

    $.ajax({
      url: apiCall,
      type: "GET",
      dataType: "json",
      success: function(resp) {
        tableau.log("resp: " + resp);
        var results = resp.contentSources;
        table.appendRows(
          results.map(function(result) {
            return {
				startDate: result.startDate,
				Facebook: result.sources.Facebook,
				Twitter: result.sources.Twitter,
				Blogs: result.sources.Blogs,
				Forums: result.sources.Forums,
				News: result.sources.News,
				Reddit:result.sources.Reddit
            };
          })
        );
        doneCallback();
      },
      error: function() {
        console.log("error in ajax call!");
      },
      beforeSend: setHeader
    });
  };

  function setHeader(xhr) {
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-auth-token", tableau.password);
    xhr.setRequestHeader("accept", "application/hal+json");
	xhr.setRequestHeader('origin', 'x-requested-with')
  }
    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Social Media Master Monitor"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();