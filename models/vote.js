var mongoose = require( 'mongoose' );

var VoteSchema = new mongoose.Schema( {
	idea: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Idea'
	}
} );

mongoose.model( 'Vote', VoteSchema );
