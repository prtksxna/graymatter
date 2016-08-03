// ## Group schema

var GroupSchema, Group,
	mongoose = require( 'mongoose' );

GroupSchema = new mongoose.Schema( {
	name: {
		type: String,
		required: true
	},
	// > TODO: Don't separate the two kinds of members
	// > instead have an added 'role' attribute wich is
	// > an integer that decides their power
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
	var asAdmin, asMember;

	asAdmin = Group.find( {
		admins: { $in: [ userId ] }
	} ).exec();

	asMember = Group.find( {
		members: { $in: [ userId ] }
	} ).exec();

	return Promise.all( [ asAdmin, asMember ] ).then( function ( groups ) {
		return groups[ 0 ].concat( groups [ 1 ] );
	} );
};

GroupSchema.methods.canBeSeenBy = function ( userId ) {
	return this.admins.indexOf( userId ) > -1 ||
		this.members.indexOf( userId ) > -1;
};

GroupSchema.methods.addMember = function ( userId ) {
	this.members.push( userId );
	return this.save();
};

GroupSchema.methods.hasAdmin = function ( userId ) {
	// > TODO: Implement this
	return true;
};

Group = mongoose.model( 'Group', GroupSchema );
