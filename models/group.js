var GroupSchema,
	mongoose = require( 'mongoose' ),
	Schema = mongoose.Schema;

GroupSchema = new mongoose.Schema( {
	name: {
		type: String,
		required: true
	},
	admins: {
		type: [ {
			type: Schema.Types.ObjectId,
			ref: 'User'
		} ],
		required: true
	},
	members: [ {
		type: Schema.Types.ObjectId,
		ref: 'User'
	} ]
} );

mongoose.model( 'Group', GroupSchema );
