export const mockUsers = [
  // GRYFFINDOR (10)
  { id: "u1",  name: "Harry Potter",       avatar: "HP", email: "harry@hogwarts.edu",     teamId: "team-gryffindor", role: "admin" },
  { id: "u2",  name: "Hermione Granger",   avatar: "HG", email: "hermione@hogwarts.edu",  teamId: "team-gryffindor", role: "admin" },
  { id: "u3",  name: "Ron Weasley",        avatar: "RW", email: "ron@hogwarts.edu",        teamId: "team-gryffindor", role: "editor" },
  { id: "u4",  name: "Ginny Weasley",      avatar: "GW", email: "ginny@hogwarts.edu",      teamId: "team-gryffindor", role: "editor" },
  { id: "u5",  name: "Neville Longbottom", avatar: "NL", email: "neville@hogwarts.edu",    teamId: "team-gryffindor", role: "editor" },
  { id: "u6",  name: "Seamus Finnigan",    avatar: "SF", email: "seamus@hogwarts.edu",     teamId: "team-gryffindor", role: "viewer" },
  { id: "u7",  name: "Dean Thomas",        avatar: "DT", email: "dean@hogwarts.edu",       teamId: "team-gryffindor", role: "viewer" },
  { id: "u8",  name: "Lavender Brown",     avatar: "LB", email: "lavender@hogwarts.edu",   teamId: "team-gryffindor", role: "viewer" },
  { id: "u9",  name: "Parvati Patil",      avatar: "PP", email: "parvati@hogwarts.edu",    teamId: "team-gryffindor", role: "viewer" },
  { id: "u10", name: "Fred Weasley",       avatar: "FW", email: "fred@hogwarts.edu",       teamId: "team-gryffindor", role: "editor" },

  // SLYTHERIN (8)
  { id: "u11", name: "Draco Malfoy",       avatar: "DM", email: "draco@hogwarts.edu",      teamId: "team-slytherin", role: "admin" },
  { id: "u12", name: "Pansy Parkinson",    avatar: "PP", email: "pansy@hogwarts.edu",      teamId: "team-slytherin", role: "editor" },
  { id: "u13", name: "Blaise Zabini",      avatar: "BZ", email: "blaise@hogwarts.edu",     teamId: "team-slytherin", role: "editor" },
  { id: "u14", name: "Gregory Goyle",      avatar: "GG", email: "goyle@hogwarts.edu",      teamId: "team-slytherin", role: "viewer" },
  { id: "u15", name: "Vincent Crabbe",     avatar: "VC", email: "crabbe@hogwarts.edu",     teamId: "team-slytherin", role: "viewer" },
  { id: "u16", name: "Millicent Bulstrode",avatar: "MB", email: "millicent@hogwarts.edu",  teamId: "team-slytherin", role: "viewer" },
  { id: "u17", name: "Theodore Nott",      avatar: "TN", email: "theo@hogwarts.edu",       teamId: "team-slytherin", role: "editor" },
  { id: "u18", name: "Daphne Greengrass",  avatar: "DG", email: "daphne@hogwarts.edu",     teamId: "team-slytherin", role: "viewer" },

  // HUFFLEPUFF (7)
  { id: "u19", name: "Cedric Diggory",     avatar: "CD", email: "cedric@hogwarts.edu",     teamId: "team-hufflepuff", role: "admin" },
  { id: "u20", name: "Hannah Abbott",      avatar: "HA", email: "hannah@hogwarts.edu",     teamId: "team-hufflepuff", role: "editor" },
  { id: "u21", name: "Ernie Macmillan",    avatar: "EM", email: "ernie@hogwarts.edu",      teamId: "team-hufflepuff", role: "editor" },
  { id: "u22", name: "Justin Finch-Fletchley", avatar: "JF", email: "justin@hogwarts.edu", teamId: "team-hufflepuff", role: "viewer" },
  { id: "u23", name: "Susan Bones",        avatar: "SB", email: "susan@hogwarts.edu",      teamId: "team-hufflepuff", role: "viewer" },
  { id: "u24", name: "Zacharias Smith",    avatar: "ZS", email: "zacharias@hogwarts.edu",  teamId: "team-hufflepuff", role: "viewer" },
  { id: "u25", name: "Tonks Lupin",        avatar: "TL", email: "tonks@hogwarts.edu",      teamId: "team-hufflepuff", role: "editor" },

  // RAVENCLAW (7)
  { id: "u26", name: "Luna Lovegood",      avatar: "LL", email: "luna@hogwarts.edu",       teamId: "team-ravenclaw", role: "admin" },
  { id: "u27", name: "Cho Chang",          avatar: "CC", email: "cho@hogwarts.edu",         teamId: "team-ravenclaw", role: "editor" },
  { id: "u28", name: "Padma Patil",        avatar: "PP", email: "padma@hogwarts.edu",       teamId: "team-ravenclaw", role: "editor" },
  { id: "u29", name: "Michael Corner",     avatar: "MC", email: "michael@hogwarts.edu",     teamId: "team-ravenclaw", role: "viewer" },
  { id: "u30", name: "Terry Boot",         avatar: "TB", email: "terry@hogwarts.edu",       teamId: "team-ravenclaw", role: "viewer" },
  { id: "u31", name: "Anthony Goldstein",  avatar: "AG", email: "anthony@hogwarts.edu",     teamId: "team-ravenclaw", role: "viewer" },
  { id: "u32", name: "Filius Flitwick",    avatar: "FF", email: "flitwick@hogwarts.edu",    teamId: "team-ravenclaw", role: "editor" },

  // ORDER OF THE PHOENIX (7)
  { id: "u33", name: "Albus Dumbledore",   avatar: "AD", email: "dumbledore@hogwarts.edu",  teamId: "team-order", role: "admin" },
  { id: "u34", name: "Sirius Black",       avatar: "SB", email: "sirius@hogwarts.edu",      teamId: "team-order", role: "admin" },
  { id: "u35", name: "Remus Lupin",        avatar: "RL", email: "remus@hogwarts.edu",       teamId: "team-order", role: "editor" },
  { id: "u36", name: "Minerva McGonagall", avatar: "MM", email: "mcgonagall@hogwarts.edu",  teamId: "team-order", role: "admin" },
  { id: "u37", name: "Molly Weasley",      avatar: "MW", email: "molly@hogwarts.edu",       teamId: "team-order", role: "editor" },
  { id: "u38", name: "Arthur Weasley",     avatar: "AW", email: "arthur@hogwarts.edu",      teamId: "team-order", role: "editor" },
  { id: "u39", name: "Alastor Moody",      avatar: "AM", email: "moody@hogwarts.edu",       teamId: "team-order", role: "editor" },

  // MINISTRY OF MAGIC (6)
  { id: "u40", name: "Cornelius Fudge",    avatar: "CF", email: "fudge@ministry.gov",       teamId: "team-ministry", role: "admin" },
  { id: "u41", name: "Dolores Umbridge",   avatar: "DU", email: "umbridge@ministry.gov",    teamId: "team-ministry", role: "admin" },
  { id: "u42", name: "Percy Weasley",      avatar: "PW", email: "percy@ministry.gov",       teamId: "team-ministry", role: "editor" },
  { id: "u43", name: "Kingsley Shacklebolt",avatar: "KS", email: "kingsley@ministry.gov",  teamId: "team-ministry", role: "editor" },
  { id: "u44", name: "Rufus Scrimgeour",   avatar: "RS", email: "rufus@ministry.gov",       teamId: "team-ministry", role: "admin" },
  { id: "u45", name: "Pius Thicknesse",    avatar: "PT", email: "pius@ministry.gov",        teamId: "team-ministry", role: "viewer" },

  // DUMBLEDORE'S ARMY (5)
  { id: "u46", name: "George Weasley",     avatar: "GW", email: "george@hogwarts.edu",      teamId: "team-da", role: "editor" },
  { id: "u47", name: "Lee Jordan",         avatar: "LJ", email: "lee@hogwarts.edu",         teamId: "team-da", role: "editor" },
  { id: "u48", name: "Katie Bell",         avatar: "KB", email: "katie@hogwarts.edu",       teamId: "team-da", role: "viewer" },
  { id: "u49", name: "Angelina Johnson",   avatar: "AJ", email: "angelina@hogwarts.edu",    teamId: "team-da", role: "editor" },
  { id: "u50", name: "Oliver Wood",        avatar: "OW", email: "oliver@hogwarts.edu",      teamId: "team-da", role: "admin" },
];

export const mockTeams = [
  { id: "team-gryffindor", name: "Gryffindor",            color: "#c84b31", memberIds: ["u1","u2","u3","u4","u5","u6","u7","u8","u9","u10"] },
  { id: "team-slytherin",  name: "Slytherin",             color: "#2a623d", memberIds: ["u11","u12","u13","u14","u15","u16","u17","u18"] },
  { id: "team-hufflepuff", name: "Hufflepuff",            color: "#f0c040", memberIds: ["u19","u20","u21","u22","u23","u24","u25"] },
  { id: "team-ravenclaw",  name: "Ravenclaw",             color: "#2250a2", memberIds: ["u26","u27","u28","u29","u30","u31","u32"] },
  { id: "team-order",      name: "Order of the Phoenix",  color: "#7b2d8b", memberIds: ["u33","u34","u35","u36","u37","u38","u39"] },
  { id: "team-ministry",   name: "Ministry of Magic",     color: "#1a1a2e", memberIds: ["u40","u41","u42","u43","u44","u45"] },
  { id: "team-da",         name: "Dumbledore's Army",     color: "#e07b39", memberIds: ["u46","u47","u48","u49","u50"] },
];
