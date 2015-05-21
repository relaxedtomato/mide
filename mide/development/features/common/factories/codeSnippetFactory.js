app.factory('CodeSnippetFactory', function(){
	
	var brackets = [
		{
			display: "[ ]",
			insertParam: "[]"
		},
		{
			display: "{ }",
			insertParam: "{}"
		},
		{
			display: "( )",
			insertParam: "()"
		},
		{
			display: "//",
			insertParam: "//"
		},
		{
			display: "/*  */",
			insertParam: "/* */"
		},

	];

	var CodeSnippets = [
		{
			display: "fn",
			insertParam: "function(){ }"
		},
		{
			display: "for",
			insertParam: "for(var i= ;i< ;i++){ }"
		},
		{
			display: "while",
			insertParam: "while( ){ }"
		},
		{
			display: "do while",
			insertParam: "do { } while( );"
		},
		{
			display: "log",
			insertParam: "console.log();"
		},
	];

	var comparators = [
		{
			display: "!",
			insertParam: "!"
		},
		{
			display: "@",
			insertParam: "@"
		},
		{
			display: "#",
			insertParam: "#"
		},
		{
			display: "$",
			insertParam: "$"
		},
		{
			display: "%",
			insertParam: "%"
		},
		{
			display: "=",
			insertParam: "="
		},
		{
			display: "<",
			insertParam: "<"
		},
		{
			display: ">",
			insertParam: ">"
		}
	];

	var footerMenu = [
		{
			display: "Custom",
			data: CodeSnippets
		},
		{
			display: "Special",
			data: comparators
		},
		{
			display: "Brackets",
			data: brackets
		}
	];

	// var getHotkeys = function(){
	// 	return footerHotkeys;
	// };

	return 	{
				getFooterMenu : function(){
					return footerMenu;
				}
			};
});