import { type User, type TeamEvent, type ChatChannel, type ChatMessage, type TeamAnnouncement } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-coach-1',
    name: 'Steve Anderson',
    role: 'head_coach',
    email: 'steve.anderson@moundsviewschools.org',
    phone: '(651) 621-7100',
    birthday: '1982-05-18',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: '12th year as MVHS Girls Swim & Dive Head Coach. MSHSL Section 4AA Coach of the Year 2022 & 2024. Go Mustangs!',
    isAdmin: true,
    parents: []
  },
  {
    id: 'u-coach-2',
    name: 'Sarah Lindquist',
    role: 'assistant_coach',
    email: 'sarah.lindquist@moundsviewschools.org',
    phone: '(651) 621-7102',
    birthday: '1991-09-24',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Assistant Coach specializing in sprint stroke mechanics & turns. Former collegiate D1 swimmer.',
    isAdmin: true,
    parents: []
  },
  {
    id: 'u-coach-3',
    name: 'Mark Henderson',
    role: 'diving_coach',
    email: 'mark.henderson@moundsviewschools.org',
    phone: '(651) 621-7105',
    birthday: '1987-11-03',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'MVHS Head Diving Coach. Coaching 1-meter springboard & dryland twisting techniques.',
    isAdmin: true,
    parents: []
  },
  {
    id: 'u-capt-1',
    name: 'Emma Peterson',
    role: 'captain',
    athleteType: 'swimmer',
    grade: 12,
    email: 'emma.peterson@moundsviewstudents.org',
    phone: '(651) 402-8819',
    birthday: '2007-03-15',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Team Captain. 100 Butterfly & 200 Freestyle. Let’s bring home the SEC Championship!',
    events: ['100 Butterfly', '200 Freestyle', '200 Medley Relay (Fly)', '400 Free Relay'],
    tShirtSize: 'M',
    isAdmin: true,
    emergencyNotes: 'Carries rescue inhaler for mild exercise asthma.',
    parents: [
      {
        id: 'p-ep-1',
        name: 'David Peterson',
        relationship: 'Father',
        phone: '(651) 324-9901',
        email: 'david.peterson@comcast.net',
        isPrimary: true,
        isEmergencyContact: true
      },
      {
        id: 'p-ep-2',
        name: 'Karen Peterson',
        relationship: 'Mother',
        phone: '(651) 324-9902',
        email: 'karen.peterson@gmail.com',
        isPrimary: false,
        isEmergencyContact: true
      }
    ]
  },
  {
    id: 'u-capt-2',
    name: 'Chloe Larson',
    role: 'captain',
    athleteType: 'swimmer',
    grade: 12,
    email: 'chloe.larson@moundsviewstudents.org',
    phone: '(651) 515-7281',
    birthday: '2007-06-22',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Team Captain. 50 Free & 100 Breaststroke. Sprint squad hype leader!',
    events: ['50 Freestyle', '100 Breaststroke', '200 Free Relay (Anchor)'],
    tShirtSize: 'S',
    isAdmin: true,
    parents: [
      {
        id: 'p-cl-1',
        name: 'Michelle Larson',
        relationship: 'Mother',
        phone: '(651) 689-1123',
        email: 'm.larson@healthpartners.com',
        isPrimary: true,
        isEmergencyContact: true
      },
      {
        id: 'p-cl-2',
        name: 'Brian Larson',
        relationship: 'Father',
        phone: '(651) 689-1124',
        email: 'brian.larson@3m.com',
        isPrimary: false,
        isEmergencyContact: true
      }
    ]
  },
  {
    id: 'u-capt-3',
    name: 'Maya Chen',
    role: 'captain',
    athleteType: 'diver',
    grade: 12,
    email: 'maya.chen@moundsviewstudents.org',
    phone: '(651) 489-3341',
    birthday: '2007-08-10',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Diving Captain. 1-Meter Diving. State meet qualifier 2023 & 2024.',
    events: ['1-Meter Springboard Diving (11 Dives)'],
    tShirtSize: 'S',
    isAdmin: true,
    parents: [
      {
        id: 'p-mc-1',
        name: 'Li Wei Chen',
        relationship: 'Father',
        phone: '(651) 772-4409',
        email: 'lwchen@umn.edu',
        isPrimary: true,
        isEmergencyContact: true
      },
      {
        id: 'p-mc-2',
        name: 'Grace Chen',
        relationship: 'Mother',
        phone: '(651) 772-4410',
        email: 'grace.chen@medtronic.com',
        isPrimary: false,
        isEmergencyContact: true
      }
    ]
  },
  {
    id: 'u-swimmer-1',
    name: 'Lily Nguyen',
    role: 'swimmer',
    athleteType: 'swimmer',
    grade: 11,
    email: 'lily.nguyen@moundsviewstudents.org',
    phone: '(651) 815-9923',
    birthday: '2008-01-29',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Junior. 200 IM & 100 Breaststroke. Pasta party dessert enthusiast.',
    events: ['200 Individual Medley', '100 Breaststroke', '200 Medley Relay (Breast)'],
    tShirtSize: 'S',
    isAdmin: false,
    parents: [
      {
        id: 'p-ln-1',
        name: 'Hao Nguyen',
        relationship: 'Father',
        phone: '(651) 902-3344',
        email: 'hao.nguyen@target.com',
        isPrimary: true,
        isEmergencyContact: true
      },
      {
        id: 'p-ln-2',
        name: 'Trang Nguyen',
        relationship: 'Mother',
        phone: '(651) 902-3345',
        email: 'trang.nguyen@gmail.com',
        isPrimary: false,
        isEmergencyContact: true
      }
    ]
  },
  {
    id: 'u-swimmer-2',
    name: 'Sophia Miller',
    role: 'swimmer',
    athleteType: 'swimmer',
    grade: 11,
    email: 'sophia.miller@moundsviewstudents.org',
    phone: '(651) 334-1189',
    birthday: '2008-04-14',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    bio: 'Junior Distance Swimmer. 500 Freestyle & 200 Freestyle. Pacing is everything!',
    events: ['500 Freestyle', '200 Freestyle', '400 Free Relay'],
    tShirtSize: 'M',
    isAdmin: false,
    parents: [
      {
        id: 'p-sm-1',
        name: 'Robert Miller',
        relationship: 'Father',
        phone: '(651) 441-2900',
        email: 'rmiller@usbank.com',
        isPrimary: true,
        isEmergencyContact: true
      }
    ]
  },
  {
    id: 'u-diver-1',
    name: 'Ava Johnson',
    role: 'diver',
    athleteType: 'diver',
    grade: 11,
    email: 'ava.johnson@moundsviewstudents.org',
    phone: '(651) 762-0941',
    birthday: '2008-07-19',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
    bio: 'Junior Diver. Working on Inward 1.5 Somersault Pike & Twisters.',
    events: ['1-Meter Springboard Diving'],
    tShirtSize: 'XS',
    isAdmin: false,
    parents: [
      {
        id: 'p-aj-1',
        name: 'Jennifer Johnson',
        relationship: 'Mother',
        phone: '(651) 883-7120',
        email: 'jen.johnson@ecolab.com',
        isPrimary: true,
        isEmergencyContact: true
      },
      {
        id: 'p-aj-2',
        name: 'Kurt Johnson',
        relationship: 'Father',
        phone: '(651) 883-7121',
        email: 'kurt.j@gmail.com',
        isPrimary: false,
        isEmergencyContact: true
      }
    ]
  },
  {
    id: 'u-swimmer-3',
    name: 'Ella Davis',
    role: 'swimmer',
    athleteType: 'swimmer',
    grade: 10,
    email: 'ella.davis@moundsviewstudents.org',
    phone: '(651) 644-8832',
    birthday: '2009-02-05',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
    bio: 'Sophomore. 100 Backstroke & 100 Freestyle. Relay anchor in training.',
    events: ['100 Backstroke', '100 Freestyle', '200 Medley Relay (Back)'],
    tShirtSize: 'S',
    isAdmin: false,
    parents: [
      {
        id: 'p-ed-1',
        name: 'Thomas Davis',
        relationship: 'Father',
        phone: '(651) 991-3829',
        email: 'tom.davis@bestbuy.com',
        isPrimary: true,
        isEmergencyContact: true
      }
    ]
  },
  {
    id: 'u-swimmer-4',
    name: 'Grace Wilson',
    role: 'swimmer',
    athleteType: 'swimmer',
    grade: 10,
    email: 'grace.wilson@moundsviewstudents.org',
    phone: '(651) 223-9081',
    birthday: '2009-09-12',
    avatar: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=150&auto=format&fit=crop&q=80',
    bio: 'Sophomore. 100 Butterfly & 50 Freestyle.',
    events: ['100 Butterfly', '50 Freestyle'],
    tShirtSize: 'S',
    isAdmin: false,
    parents: [
      {
        id: 'p-gw-1',
        name: 'Laura Wilson',
        relationship: 'Mother',
        phone: '(651) 459-7100',
        email: 'laura.wilson@gmail.com',
        isPrimary: true,
        isEmergencyContact: true
      }
    ]
  },
  {
    id: 'u-diver-2',
    name: 'Mia Taylor',
    role: 'diver',
    athleteType: 'diver',
    grade: 10,
    email: 'mia.taylor@moundsviewstudents.org',
    phone: '(651) 843-2219',
    birthday: '2009-12-01',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=150&auto=format&fit=crop&q=80',
    bio: 'Sophomore Diver. Board presence and clean rips!',
    events: ['1-Meter Springboard Diving'],
    tShirtSize: 'XS',
    isAdmin: false,
    parents: [
      {
        id: 'p-mt-1',
        name: 'Chris Taylor',
        relationship: 'Father',
        phone: '(651) 712-9844',
        email: 'ctaylor@generalmills.com',
        isPrimary: true,
        isEmergencyContact: true
      }
    ]
  },
  {
    id: 'u-swimmer-5',
    name: 'Olivia Anderson',
    role: 'swimmer',
    athleteType: 'swimmer',
    grade: 9,
    email: 'olivia.anderson@moundsviewstudents.org',
    phone: '(651) 918-4720',
    birthday: '2010-03-20',
    avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&auto=format&fit=crop&q=80',
    bio: 'Freshman! Excited for my first high school swim season with the Mustangs.',
    events: ['50 Freestyle', '100 Freestyle', '200 Freestyle'],
    tShirtSize: 'S',
    isAdmin: false,
    parents: [
      {
        id: 'p-oa-1',
        name: 'Kelly Anderson',
        relationship: 'Mother',
        phone: '(651) 554-3291',
        email: 'k.anderson@yahoo.com',
        isPrimary: true,
        isEmergencyContact: true
      },
      {
        id: 'p-oa-2',
        name: 'Mark Anderson',
        relationship: 'Father',
        phone: '(651) 554-3292',
        email: 'mark.a@landolakes.com',
        isPrimary: false,
        isEmergencyContact: true
      }
    ]
  },
  {
    id: 'u-swimmer-6',
    name: 'Zoe Martinez',
    role: 'swimmer',
    athleteType: 'swimmer',
    grade: 9,
    email: 'zoe.martinez@moundsviewstudents.org',
    phone: '(651) 401-6355',
    birthday: '2010-06-18',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    bio: 'Freshman. 100 Breaststroke & 200 IM.',
    events: ['100 Breaststroke', '200 IM'],
    tShirtSize: 'S',
    isAdmin: false,
    parents: [
      {
        id: 'p-zm-1',
        name: 'Elena Martinez',
        relationship: 'Mother',
        phone: '(651) 682-9011',
        email: 'elena.martinez@allinahealth.org',
        isPrimary: true,
        isEmergencyContact: true
      }
    ]
  },
  {
    id: 'u-manager-1',
    name: 'Samantha Hall',
    role: 'manager',
    grade: 12,
    email: 'samantha.hall@moundsviewstudents.org',
    phone: '(651) 338-9104',
    birthday: '2007-04-02',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    bio: 'Team Student Manager. Keeping splits, timing, meet sheets, and equipment organized!',
    isAdmin: false,
    parents: [
      {
        id: 'p-sh-1',
        name: 'James Hall',
        relationship: 'Father',
        phone: '(651) 220-4491',
        email: 'jhall@mncourts.gov',
        isPrimary: true,
        isEmergencyContact: true
      }
    ]
  }
];

export const INITIAL_EVENTS: TeamEvent[] = [
  {
    id: 'evt-1',
    title: 'Dual Meet vs Stillwater Ponies (Home)',
    type: 'swimmers_meet',
    date: '2026-08-27',
    startTime: '17:00',
    endTime: '19:30',
    location: 'Mounds View High School Natatorium (Pool Deck)',
    isHome: true,
    opponent: 'Stillwater Ponies',
    warmupTime: '15:45',
    description: 'Suburban East Conference home opener! Green & Gold spirit wear. Swimmers & divers warmup at 15:45.',
    snackVolunteer: 'Karen Peterson & Hao Nguyen',
    createdBy: 'u-coach-1',
    createdByName: 'Coach Steve Anderson',
    rsvps: {
      'u-capt-1': { userId: 'u-capt-1', userName: 'Emma Peterson', userRole: 'captain', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-capt-2': { userId: 'u-capt-2', userName: 'Chloe Larson', userRole: 'captain', status: 'going', updatedAt: '2026-08-23T09:10:00Z' },
      'u-capt-3': { userId: 'u-capt-3', userName: 'Maya Chen', userRole: 'captain', status: 'going', updatedAt: '2026-08-23T09:12:00Z' },
      'u-swimmer-1': { userId: 'u-swimmer-1', userName: 'Lily Nguyen', userRole: 'swimmer', status: 'going', updatedAt: '2026-08-23T09:30:00Z' },
      'u-swimmer-2': { userId: 'u-swimmer-2', userName: 'Sophia Miller', userRole: 'swimmer', status: 'going', updatedAt: '2026-08-23T09:45:00Z' },
      'u-diver-1': { userId: 'u-diver-1', userName: 'Ava Johnson', userRole: 'diver', status: 'going', updatedAt: '2026-08-23T10:00:00Z' },
      'u-swimmer-3': { userId: 'u-swimmer-3', userName: 'Ella Davis', userRole: 'swimmer', status: 'going', updatedAt: '2026-08-23T10:15:00Z' },
      'u-swimmer-4': { userId: 'u-swimmer-4', userName: 'Grace Wilson', userRole: 'swimmer', status: 'excused', notes: 'Dentist appointment, arriving by 16:30 for 100 Fly', updatedAt: '2026-08-23T11:00:00Z' },
      'u-diver-2': { userId: 'u-diver-2', userName: 'Mia Taylor', userRole: 'diver', status: 'going', updatedAt: '2026-08-23T11:20:00Z' },
      'u-swimmer-5': { userId: 'u-swimmer-5', userName: 'Olivia Anderson', userRole: 'swimmer', status: 'going', updatedAt: '2026-08-23T11:30:00Z' },
      'u-swimmer-6': { userId: 'u-swimmer-6', userName: 'Zoe Martinez', userRole: 'swimmer', status: 'going', updatedAt: '2026-08-23T11:45:00Z' },
      'u-manager-1': { userId: 'u-manager-1', userName: 'Samantha Hall', userRole: 'manager', status: 'going', updatedAt: '2026-08-23T12:00:00Z' }
    }
  },
  {
    id: 'evt-2',
    title: 'SEC 1-Meter Diving Invitational 🤿',
    type: 'divers_meet',
    date: '2026-08-29',
    startTime: '10:00',
    endTime: '13:30',
    location: 'East Ridge High School Natatorium (Woodbury, MN)',
    isHome: false,
    opponent: 'East Ridge, Woodbury & Stillwater Divers',
    busDepartureTime: '08:30',
    warmupTime: '09:00',
    description: '11-Dive Championship meet for Varsity & JV Divers. Bring chamois towels, video cameras, and meet suits.',
    createdBy: 'u-coach-3',
    createdByName: 'Coach Mark Henderson',
    rsvps: {
      'u-capt-3': { userId: 'u-capt-3', userName: 'Maya Chen', userRole: 'captain', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-diver-1': { userId: 'u-diver-1', userName: 'Ava Johnson', userRole: 'diver', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-diver-2': { userId: 'u-diver-2', userName: 'Mia Taylor', userRole: 'diver', status: 'going', updatedAt: '2026-08-23T09:00:00Z' }
    }
  },
  {
    id: 'evt-3',
    title: 'Swimmers Afternoon Water & Dryland Workout',
    type: 'swimmers_practice',
    date: '2026-08-24',
    startTime: '15:30',
    endTime: '17:45',
    location: 'MVHS Pool & Fitness Center',
    warmupTime: '15:30',
    description: 'Relay exchanges and sprint turn progressions. Dryland core workout from 15:30-16:00.',
    createdBy: 'u-coach-1',
    createdByName: 'Coach Steve Anderson',
    rsvps: {
      'u-capt-1': { userId: 'u-capt-1', userName: 'Emma Peterson', userRole: 'captain', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-capt-2': { userId: 'u-capt-2', userName: 'Chloe Larson', userRole: 'captain', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-swimmer-1': { userId: 'u-swimmer-1', userName: 'Lily Nguyen', userRole: 'swimmer', status: 'going', updatedAt: '2026-08-23T09:00:00Z' }
    }
  },
  {
    id: 'evt-4',
    title: 'Divers Springboard & Video Analysis Practice',
    type: 'divers_practice',
    date: '2026-08-24',
    startTime: '15:15',
    endTime: '17:15',
    location: 'MVHS Diving Well & Trampoline Area',
    warmupTime: '15:15',
    description: 'Hurdle approach, voluntary DD drills, and slow-motion video review of backward 1.5s.',
    createdBy: 'u-coach-3',
    createdByName: 'Coach Mark Henderson',
    rsvps: {
      'u-capt-3': { userId: 'u-capt-3', userName: 'Maya Chen', userRole: 'captain', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-diver-1': { userId: 'u-diver-1', userName: 'Ava Johnson', userRole: 'diver', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-diver-2': { userId: 'u-diver-2', userName: 'Mia Taylor', userRole: 'diver', status: 'going', updatedAt: '2026-08-23T09:00:00Z' }
    }
  },
  {
    id: 'evt-5',
    title: 'Swimmers Morning Breakfast & Early Swim Session',
    type: 'swimmers_practice',
    date: '2026-08-25',
    startTime: '06:00',
    endTime: '07:30',
    location: 'MVHS Natatorium',
    warmupTime: '06:00',
    description: 'Aerobic threshold set + captain-led team bagels in cafeteria before 1st hour.',
    createdBy: 'u-coach-2',
    createdByName: 'Coach Sarah Lindquist',
    rsvps: {
      'u-capt-1': { userId: 'u-capt-1', userName: 'Emma Peterson', userRole: 'captain', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-swimmer-2': { userId: 'u-swimmer-2', userName: 'Sophia Miller', userRole: 'swimmer', status: 'going', updatedAt: '2026-08-23T09:00:00Z' }
    }
  },
  {
    id: 'evt-6',
    title: 'Pre-Meet Pasta Party at Peterson House 🍝',
    type: 'social',
    date: '2026-08-26',
    startTime: '18:00',
    endTime: '20:30',
    location: 'Emma Peterson’s House (5420 Lakeview Dr, Shoreview, MN)',
    description: 'Carb load before Stillwater meet! Bring assigned dishes: Seniors (Main pasta/sauces), Juniors (Salad/Breadsticks), Sophomores (Drinks/Fruit), Freshmen (Dessert).',
    snackVolunteer: 'Karen Peterson (Host)',
    createdBy: 'u-capt-1',
    createdByName: 'Emma Peterson (Captain)',
    rsvps: {
      'u-capt-1': { userId: 'u-capt-1', userName: 'Emma Peterson', userRole: 'captain', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-capt-2': { userId: 'u-capt-2', userName: 'Chloe Larson', userRole: 'captain', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-capt-3': { userId: 'u-capt-3', userName: 'Maya Chen', userRole: 'captain', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-swimmer-1': { userId: 'u-swimmer-1', userName: 'Lily Nguyen', userRole: 'swimmer', status: 'going', updatedAt: '2026-08-23T09:00:00Z' },
      'u-diver-1': { userId: 'u-diver-1', userName: 'Ava Johnson', userRole: 'diver', status: 'going', updatedAt: '2026-08-23T09:00:00Z' }
    }
  },
  {
    id: 'evt-7',
    title: 'Away Dual Meet vs Woodbury Royals',
    type: 'swimmers_meet',
    date: '2026-09-03',
    startTime: '17:30',
    endTime: '20:00',
    location: 'Woodbury High School Pool (2665 Woodlane Dr, Woodbury, MN)',
    isHome: false,
    opponent: 'Woodbury Royals',
    busDepartureTime: '15:45',
    warmupTime: '16:30',
    description: 'Bus departs outside Door 1 at MVHS promptly at 15:45. Pack team parkas and extra caps.',
    createdBy: 'u-coach-1',
    createdByName: 'Coach Steve Anderson',
    rsvps: {}
  }
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'announcements',
    name: 'Team Announcements',
    description: 'Official announcements from coaches and captains. Read & react.',
    icon: '📢',
    type: 'public',
    isLocked: true,
    createdBy: 'u-coach-1'
  },
  {
    id: 'admins-captains',
    name: 'Admins & Captains Only',
    description: 'Private strategy, lineup notes, and leadership communication.',
    icon: '👑',
    type: 'admins_only',
    allowedRoles: ['head_coach', 'assistant_coach', 'diving_coach', 'captain'],
    createdBy: 'u-coach-1'
  },
  {
    id: 'girls-team',
    name: 'Girls Squad (Athletes Only)',
    description: 'Swimmers & Divers team banter, spirit themes, and countdowns.',
    icon: '🏊‍♀️',
    type: 'girls_only',
    allowedRoles: ['captain', 'swimmer', 'diver', 'manager'],
    createdBy: 'u-capt-1'
  },
  {
    id: 'full-team',
    name: 'Full Team & Coaches',
    description: 'Open discussion for all athletes, coaches, and team managers.',
    icon: '🌟',
    type: 'public',
    createdBy: 'u-coach-1'
  },
  {
    id: 'diving-crew',
    name: 'Diving Squad',
    description: '1-Meter board technique, score sheets, and dive lists.',
    icon: '🤿',
    type: 'custom',
    allowedRoles: ['diving_coach', 'captain', 'diver'],
    createdBy: 'u-coach-3'
  },
  {
    id: 'pasta-parties',
    name: 'Pasta Parties & Socials',
    description: 'Food signups, carpools, spirit themes, and team dinners.',
    icon: '🍝',
    type: 'public',
    createdBy: 'u-capt-2'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    channelId: 'announcements',
    senderId: 'u-coach-1',
    senderName: 'Steve Anderson',
    senderRole: 'head_coach',
    content: 'Welcome to the 2026 Aqua Mustangs Season! 🐴 Please make sure all parents and athletes review the meet schedule and confirm RSVP attendance on the app for this Thursday’s Stillwater home opener by Wednesday 8 PM.',
    timestamp: '2026-08-23T08:30:00Z',
    isAnnouncement: true,
    isPinned: true,
    reactions: { '💚': ['u-capt-1', 'u-capt-2', 'u-swimmer-1', 'u-diver-1'], '🔥': ['u-capt-3', 'u-swimmer-3'] }
  },
  {
    id: 'msg-2',
    channelId: 'announcements',
    senderId: 'u-coach-3',
    senderName: 'Mark Henderson',
    senderRole: 'diving_coach',
    content: 'Diving board practice is confirmed for 3:15 PM today. Bring your voluntary dive sheets!',
    timestamp: '2026-08-23T09:15:00Z',
    reactions: { '👍': ['u-capt-3', 'u-diver-1', 'u-diver-2'] }
  },
  {
    id: 'msg-3',
    channelId: 'admins-captains',
    senderId: 'u-coach-1',
    senderName: 'Steve Anderson',
    senderRole: 'head_coach',
    content: 'Captains: Let’s review the 200 Medley and 400 Free relay combinations after practice today. We have great depth in backstroke with Ella Davis pushing varsity times.',
    timestamp: '2026-08-23T09:30:00Z'
  },
  {
    id: 'msg-4',
    channelId: 'admins-captains',
    senderId: 'u-capt-1',
    senderName: 'Emma Peterson',
    senderRole: 'captain',
    content: 'Sounds good Coach Steve! Chloe and I also designed the spirit theme for Thursday: Neon Green & Gold ribbons. We bought 50 ribbons for the team.',
    timestamp: '2026-08-23T09:35:00Z',
    reactions: { '🙌': ['u-coach-1', 'u-coach-2'] }
  },
  {
    id: 'msg-5',
    channelId: 'admins-captains',
    senderId: 'u-capt-3',
    senderName: 'Maya Chen',
    senderRole: 'captain',
    content: 'Ava and Mia are both doing the 11-dive exhibition format on Thursday too. Mark checked our DDs.',
    timestamp: '2026-08-23T09:40:00Z'
  },
  {
    id: 'msg-6',
    channelId: 'girls-team',
    senderId: 'u-capt-1',
    senderName: 'Emma Peterson',
    senderRole: 'captain',
    content: 'Hey Mustangs!! 🐴💚 First pasta party is this Wednesday at my house! Who is bringing the garlic bread & fruit?',
    timestamp: '2026-08-23T10:00:00Z',
    reactions: { '🍝': ['u-swimmer-1', 'u-swimmer-2', 'u-swimmer-5', 'u-diver-1'] }
  },
  {
    id: 'msg-7',
    channelId: 'girls-team',
    senderId: 'u-swimmer-1',
    senderName: 'Lily Nguyen',
    senderRole: 'swimmer',
    content: 'I got the garlic bread and Caesar salad! My mom is making extra breadsticks too 🥖🥗',
    timestamp: '2026-08-23T10:05:00Z',
    reactions: { '❤️': ['u-capt-1', 'u-capt-2'] }
  },
  {
    id: 'msg-8',
    channelId: 'girls-team',
    senderId: 'u-swimmer-5',
    senderName: 'Olivia Anderson',
    senderRole: 'swimmer',
    content: 'Freshman squad is bringing cupcakes and brownies! Super excited for Thursday! 🏊‍♀️🎉',
    timestamp: '2026-08-23T10:12:00Z',
    reactions: { '🧁': ['u-capt-2', 'u-swimmer-3', 'u-diver-2'] }
  },
  {
    id: 'msg-9',
    channelId: 'diving-crew',
    senderId: 'u-capt-3',
    senderName: 'Maya Chen',
    senderRole: 'captain',
    content: 'Divers: remember chamois towels and meet suits today. Coach Mark has the video camera set up for hurdle approach analysis!',
    timestamp: '2026-08-23T10:30:00Z',
    reactions: { '🌊': ['u-diver-1', 'u-diver-2'] }
  },
  {
    id: 'msg-10',
    channelId: 'pasta-parties',
    senderId: 'u-capt-2',
    senderName: 'Chloe Larson',
    senderRole: 'captain',
    content: 'Reminder for carpools to Emma’s on Wednesday: If any freshmen need a ride from MVHS after practice, let me or Emma know! We have 4 open seats.',
    timestamp: '2026-08-23T11:00:00Z',
    reactions: { '🚗': ['u-swimmer-5', 'u-swimmer-6'] }
  }
];

export const INITIAL_ANNOUNCEMENTS: TeamAnnouncement[] = [
  {
    id: 'anc-1',
    title: 'Stillwater Dual Meet - Thursday Aug 27',
    content: 'Meet warmup starts at 15:45 sharp. Wear team parkas, green caps, and bring 2 goggles. Parents volunteering for timing should report to the head official at 16:30.',
    date: '2026-08-23',
    authorName: 'Coach Steve Anderson',
    authorRole: 'head_coach',
    priority: 'high',
    pinned: true
  },
  {
    id: 'anc-2',
    title: 'Team Apparel & Parka Orders Distributed',
    content: 'Warmup jackets and team suits have arrived! Samantha (Manager) will hand them out before drylands today in the pool mezzanine.',
    date: '2026-08-22',
    authorName: 'Samantha Hall',
    authorRole: 'manager',
    priority: 'normal',
    pinned: false
  }
];
