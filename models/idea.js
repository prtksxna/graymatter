var mongoose = require( 'mongoose' );

var IdeaSchema = new mongoose.Schema( {
	text: String,
	votes: [ {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Vote'
	} ]
} );

mongoose.model( 'Idea', IdeaSchema );
