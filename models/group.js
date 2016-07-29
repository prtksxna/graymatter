var GroupSchema, Group,
	mongoose = require( 'mongoose' );

GroupSchema = new mongoose.Schema( {
	name: {
		type: String,
		required: true
	},
	admins: {
		type: [ {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		} ],
		required: true
	},
	members: [ {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	} ]
} );

Group = mongoose.model( 'Group', GroupSchema );
