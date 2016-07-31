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

GroupSchema.statics.findByUser = function ( userId ) {
	// TODO If this is meant to return all groups, we need to run two queries
	return Group.find( {
		admins: { $in: [ userId ] }
	} ).exec();
};

GroupSchema.methods.addMember = function ( userId ) {
	this.members.push( userId );
	return this.save();
};

GroupSchema.methods.hasAdmin = function ( userId ) {
	// TODO: Implement this
	return true;
};

Group = mongoose.model( 'Group', GroupSchema );
