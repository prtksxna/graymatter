var GroupSchema,
	mongoose = require( 'mongoose' ),
	Schema = mongoose.Schema;

GroupSchema = new mongoose.Schema( {
	name: String,
	admins: [ {
		type: Schema.Types.ObjectId,
		ref: 'User'
	} ],
	members: [ {
		type: Schema.Types.ObjectId,
		ref: 'User'
	} ]
} );

mongoose.model( 'Group', GroupSchema );
