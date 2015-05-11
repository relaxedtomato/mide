var mongoose = require('mongoose');

var challengeSchema = new mongoose.Schema ({
	name : {type: String, required : true},
	slug : {type: String, required : true, unique: true},
	description : {type : String, required: true},
	author : {type: String},
	rank : {type: Number},
	session : {
		projectId : {type: String},
		solutionId: {type: String},
		setup: {type: String},
		exampleFixture : {type: String}
	}
});

mongoose.model('Challenge', challengeSchema);