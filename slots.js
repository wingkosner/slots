Slots = new Meteor.Collection("slots");

if (Meteor.isClient) {

  Meteor.subscribe("all-users");

  var users = Meteor.users.find();

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });

  Template.hello.greeting = function () {
    return "Welcome to the slot picker.";
  };

  Template.hello.slots = function(){

    return Slots.find();
  }

  Template.hello.user = function(day, hour){

    if(Meteor.user() && Meteor.user().emails && Meteor.user().emails[0].address == 'deborah@deborahwingsproul.com'){

      var slot = Slots.findOne({day: day, hour: hour});

      if(slot && slot.user){

        var user = Meteor.users.findOne(slot.user);

        if(user && user.emails){

          return user.emails[0].address;
        }
      }
    }
  }

  Template.hello.hasSlot = function(day, hour){

    //return day + '_' + hour;

    var slot = Slots.findOne({day: day, hour: hour});

    var ret = '';

    if(slot && slot.user && slot.user == Meteor.userId()){

      ret += ' me';
    }

    if(slot){

      ret += ' taken';
    }
    
    return ret;

    //console.log(slot);
  }

  Template.hello.days = function(){

    var days = new Array(
      {day:'Tuesday, July 30th'}, 
      {day:'Wednesday, July 31st'},
      {day:'Thursday, August 1'},
      {day:'Friday, August 2'},
      {day:'Saturday, August 3'},
      {day:'Sunday, August 4'}
    );

    return days;
  }

  Template.hello.hours = function(){

    var hours = new Array(
      {hour:8}, 
      {hour:9},
      {hour:10},
      {hour:11},
      {hour:12}
    );

    return hours;
  }


  Template.hello.events({

    'click td.slot:not(.taken)' : function (event) {

      // template data, if any, is available in 'this'
  
      var input = $(event.currentTarget);

      var day = input.data('day');
      var hour = input.closest('tr').data('hour');

      if(Meteor.userId()){

        var existing = Slots.findOne({user: Meteor.userId()});

        if(existing){

          Slots.remove(existing._id);

        }

        Slots.insert({day: day, hour: hour, user: Meteor.userId()});
        
      }else{

        alert('Sorry, you need to log in to pick a time slot');

      }
    }

    /*'click h1': function(event){

        $('body').html(Meteor.render(function () {return Template.goodbye()}));
    
    }*/

  });
}

if (Meteor.isServer) {

  Meteor.publish("all-users", function (object_id) {

    return Meteor.users.find({},{fields:{username: 1, emails: 1}});

  });


  Meteor.startup(function () {
    // code to run on server at startup
  });
}
